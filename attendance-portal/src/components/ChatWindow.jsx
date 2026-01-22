import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MoreHorizontal, Loader2, X } from 'lucide-react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ recipientName, recipientId, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    // 1. Fetch Chat History on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await chatAPI.getHistory(recipientId);
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to load chat history");
            } finally {
                setLoading(false);
            }
        };

        if (recipientId) fetchHistory();
        
        // Optional: Set up polling every 5 seconds to check for new messages
        const interval = setInterval(fetchHistory, 5000);
        return () => clearInterval(interval);
    }, [recipientId]);

    // 2. Auto-scroll to bottom when messages update
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || sending) return;

        const messageContent = input.trim();
        setInput(""); // Optimistic clear
        setSending(true);

        try {
            const res = await chatAPI.sendMessage({
                recipientId,
                text: messageContent,
                senderId: user.id,
                timestamp: new Date().toISOString()
            });
            
            // Update local state with the saved message from server
            setMessages(prev => [...prev, res.data]);
        } catch (err) {
            console.error("Message not sent");
            alert("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white rounded-[40px] shadow-2xl flex flex-col h-[600px] border border-slate-100 overflow-hidden relative">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="bg-indigo-500 p-3 rounded-2xl"><User size={20}/></div>
                        <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                    </div>
                    <div>
                        <p className="font-black text-sm">{recipientName || "Loading..."}</p>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                            Official Channel
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <MoreHorizontal className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
                    {onClose && (
                        <button onClick={onClose} className="text-slate-500 hover:text-white">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Message Area */}
            <div 
                ref={scrollRef}
                className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 scroll-smooth"
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <Loader2 className="animate-spin text-indigo-600" />
                        <p className="text-xs text-slate-400 font-bold">Syncing messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-400 text-sm italic">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === user.id || msg.sender === "You";
                        return (
                            <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                                    isMe 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                }`}>
                                    <p className="leading-relaxed">{msg.text}</p>
                                    <p className={`text-[10px] mt-2 font-bold flex items-center gap-1 ${
                                        isMe ? 'text-indigo-200' : 'text-slate-400'
                                    }`}>
                                        {msg.time || new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && <span className="text-[8px]">●</span>}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-5 bg-white border-t border-slate-100 flex gap-3">
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your message..." 
                    disabled={loading}
                    className="flex-1 bg-slate-100 px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm disabled:opacity-50" 
                />
                <button 
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;