import React, { useState, useEffect } from 'react';
import { 
    Upload, Users, FileText, LogOut, Loader2, 
    Search, Bell, MessageCircle, MoreVertical, 
    ChevronRight, CheckCircle // Added CheckCircle import
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { menteeAPI } from '../../services/api';
import ChatWindow from '../../components/ChatWindow';

const MenteeDashboard = () => {
    const { logout, user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, alerts: 0 });
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, studentsRes] = await Promise.all([
                menteeAPI.getDashboardStats(),
                menteeAPI.getStudents()
            ]);
            setStats(statsRes.data || { total: 0, alerts: 0 });
            setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const confirmUpload = window.confirm(`Upload ${file.name}? This will overwrite existing records.`);
        if (!confirmUpload) return;

        setUploading(true);
        try {
            await menteeAPI.uploadExcel(file);
            alert("Attendance Database Updated Successfully!");
            fetchDashboardData();
        } catch (err) {
            alert("Upload failed. Please check the Excel format.");
        } finally {
            setUploading(false);
        }
    };

    // DEBUGGED FILTER LOGIC
    const filteredStudents = students.filter(s => {
        // Handle case where backend might use 'fullName' instead of 'name'
        const nameToSearch = s.fullName || s.name || ""; 
        const rollToSearch = s.rollNo || "";
        
        return (
            nameToSearch.toLowerCase().includes(searchTerm.toLowerCase()) || 
            rollToSearch.includes(searchTerm)
        );
    });

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600 size-10" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 text-white p-6 hidden lg:flex flex-col">
                <div className="mb-10 px-2">
                    <h1 className="text-2xl font-black italic text-indigo-400 tracking-tighter">MentorPortal.</h1>
                    <p className="text-slate-500 text-xs font-bold uppercase mt-1">Management System</p>
                </div>
                
                <nav className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 p-3.5 bg-indigo-600 rounded-2xl cursor-pointer shadow-lg font-bold">
                        <Users size={20} /> Overview
                    </div>
                    <div className="flex items-center gap-3 p-3.5 text-slate-400 hover:bg-slate-800 rounded-2xl cursor-pointer transition-all">
                        <FileText size={20} /> Academic Reports
                    </div>
                </nav>

                <div className="bg-slate-800/50 p-4 rounded-3xl border border-slate-700">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-3">Logged in as</p>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white uppercase">
                            {user?.username?.substring(0, 2) || "ME"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.username || "Mentor"}</p>
                            <p className="text-[10px] text-slate-400">ID: {user?.id || 'M-992'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800">Mentee Overview</h2>
                        <p className="text-slate-500 font-medium">Semester IV | Academic Year 2024-25</p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search by name or roll..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={logout} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 border border-red-100">
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
                        <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><Users size={28} /></div>
                        <div>
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Students Assigned</p>
                            <h3 className="text-3xl font-black text-slate-800">{stats.total}</h3>
                        </div>
                    </div>
                    <div className="bg-orange-500 p-6 rounded-3xl shadow-lg flex items-center gap-5 text-white">
                        <div className="bg-white/20 p-4 rounded-2xl"><Bell size={28} /></div>
                        <div>
                            <p className="text-orange-100 font-bold uppercase text-[10px] tracking-widest">Attendance Alerts</p>
                            <h3 className="text-3xl font-black">{stats.alerts}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
                        <input type="file" className="hidden" id="excel-upload" onChange={handleFileChange} accept=".xlsx, .xls" />
                        <label htmlFor="excel-upload" className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl font-bold cursor-pointer hover:bg-black transition-all">
                            {uploading ? <Loader2 className="animate-spin size-5" /> : <Upload size={20} />}
                            {uploading ? "Updating..." : "Sync Database"}
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">Student Records</h3>
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{filteredStudents.length} Students</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="p-5 text-xs font-bold text-slate-400 uppercase">Student Name</th>
                                            <th className="p-5 text-xs font-bold text-slate-400 uppercase">Roll Number</th>
                                            <th className="p-5 text-xs font-bold text-slate-400 uppercase">Attendance</th>
                                            <th className="p-5 text-xs font-bold text-slate-400 uppercase text-right">Chat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredStudents.map((student) => {
                                            const sName = student.fullName || student.name || "Unknown";
                                            return (
                                                <tr key={student.rollNo} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 uppercase">
                                                                {sName.charAt(0)}
                                                            </div>
                                                            <span className="font-bold text-slate-700 text-sm">{sName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-sm font-medium text-slate-500">{student.rollNo}</td>
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 bg-slate-100 h-1.5 rounded-full">
                                                                <div 
                                                                    className={`h-full rounded-full ${student.actualAttendance < 75 ? 'bg-red-500' : 'bg-green-500'}`} 
                                                                    style={{ width: `${student.actualAttendance || 0}%` }}
                                                                />
                                                            </div>
                                                            <span className={`text-xs font-black ${student.actualAttendance < 75 ? 'text-red-500' : 'text-green-600'}`}>
                                                                {student.actualAttendance || 0}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <button 
                                                            onClick={() => setSelectedChat(student)}
                                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                        >
                                                            <MessageCircle size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-10">
                            {selectedChat ? (
                                <ChatWindow 
                                    recipientName={`Parent of ${selectedChat.fullName || selectedChat.name}`} 
                                    onClose={() => setSelectedChat(null)}
                                />
                            ) : (
                                <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl">
                                    <h4 className="text-xl font-black mb-4">Quick Insights</h4>
                                    <div className="space-y-4">
                                        <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3">
                                            <div className="bg-white/20 p-2 rounded-xl text-green-300"><CheckCircle size={20} /></div>
                                            <div>
                                                <p className="text-xs font-bold opacity-70">Status</p>
                                                <p className="text-sm font-bold">All reports updated</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 bg-white text-indigo-600 font-black py-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                        Send Alerts <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MenteeDashboard;