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

    const fetchHistory = async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            const res = await chatAPI.getHistory(recipientId);
            // Ensure we are setting an array even if the limit returns fewer items
            setMessages(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load chat history:", err);
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    useEffect(() => {
        if (recipientId) {
            fetchHistory(true);
            const interval = setInterval(() => fetchHistory(false), 5000);
            return () => clearInterval(interval);
        }
    }, [recipientId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        const text = input.trim();
        if (!text || sending) return;

        setInput(""); 
        setSending(true);

        try {
            const res = await chatAPI.sendMessage({ recipientId, text });
            setMessages(prev => [...prev, res.data]);
        } catch (err) {
            console.error("Message not sent:", err);
            setInput(text);
            alert("Failed to send message.");
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
                        <p className="font-black text-sm">{recipientName || "Contact"}</p>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                            Secure Chat (Last 5)
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <MoreHorizontal className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
                    {onClose && (
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Message Area */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <Loader2 className="animate-spin text-indigo-600" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Loading conversation...</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        // ROBUST ID CHECK: Forces comparison as lowercase strings
                        const isMe = String(msg.senderId).toLowerCase() === String(user?.id).toLowerCase();

                        return (
                            <div 
                                key={msg.id || index} 
                                className={`flex w-full ${isMe ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`flex flex-col ${isMe ? 'items-start' : 'items-end'} max-w-[80%]`}>
                                    <div className={`px-4 py-3 rounded-3xl text-sm font-medium shadow-sm transition-all ${
                                        isMe 
                                        ? 'bg-indigo-600 text-white rounded-tl-none' 
                                        : 'bg-white text-slate-700 rounded-tr-none border border-slate-200'
                                    }`}>
                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                    
                                    <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMe ? 'flex-row' : 'flex-row-reverse'}`}>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                            {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </p>
                                        {isMe && (
                                            <span className="text-indigo-500 text-[10px] font-black italic">
                                                {msg.isRead ? 'Seen' : 'Sent'}
                                            </span>
                                        )}
                                    </div>
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
                    className="flex-1 bg-slate-100 px-5 py-4 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white border border-transparent focus:border-indigo-100 transition-all font-medium text-sm" 
                />
                <button 
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="bg-indigo-600 text-white p-4 rounded-[20px] hover:bg-indigo-700 transition-all active:scale-90 disabled:opacity-40 disabled:grayscale shadow-lg shadow-indigo-200"
                >
                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;