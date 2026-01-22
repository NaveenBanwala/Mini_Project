import React, { useState, useEffect } from 'react';
import { AlertTriangle, LogOut, User, Phone, Mail, BookOpen, Loader2 } from 'lucide-react';
import ChatWindow from '../../components/ChatWindow';
import { useAuth } from '../../context/AuthContext';
import { parentAPI } from '../../services/api';

const ParentDashboard = () => {
    const { logout, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [menteeDetails, setMenteeDetails] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            // STRICT CHECK: Ensure we only use rollNo for the API call
            const rollNo = user?.rollNo; 

            if (!rollNo) {
                setLoading(false);
                setError("No student roll number is linked to this parent account.");
                return;
            }

            try {
                setLoading(true);
                const res = await parentAPI.getChildData(rollNo);
                
                // Expecting response format: { student: {...}, mentor: {...} }
                if (res.data) {
                    setStudentData(res.data.student);
                    setMenteeDetails(res.data.mentor);
                }
            } catch (err) {
                console.error("Failed to load dashboard data", err);
                setError("Student record not found. Please contact the administrator.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadData();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-indigo-600" size={48} />
                    <p className="text-slate-500 font-medium">Loading Student Profile...</p>
                </div>
            </div>
        );
    }

    if (error || !studentData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
                    <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-bold text-slate-800">{error || "No data found"}</h2>
                    <p className="text-slate-500 mt-2 text-sm">Verify that your account is correctly linked to a student roll number in the database.</p>
                    <button onClick={() => window.location.reload()} className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
                        Retry
                    </button>
                    <button onClick={logout} className="mt-2 block w-full text-slate-400 text-sm underline">Logout</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 mb-2">Parent Portal</h1>
                        <p className="text-slate-500 font-medium">Viewing Profile: {studentData.fullName}</p>
                    </div>
                    <button onClick={logout} className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl border border-slate-200 shadow-sm transition-colors">
                        <LogOut />
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        {/* Attendance Warning */}
                        {studentData.actualAttendance < 75 && (
                            <div className="bg-red-500 text-white p-6 rounded-[32px] flex items-center gap-6 shadow-xl shadow-red-200 animate-pulse">
                                <div className="bg-white/20 p-4 rounded-2xl"><AlertTriangle size={32} /></div>
                                <div>
                                    <h4 className="font-black text-xl">Low Attendance Alert</h4>
                                    <p className="text-red-100 opacity-90">
                                        {studentData.fullName}'s attendance is {studentData.actualAttendance}%. Minimum 75% required.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Attendance Gauge */}
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">Attendance Status</h3>
                                <div className="relative flex items-center justify-center">
                                    <svg className="w-40 h-40">
                                        <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                        <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                                strokeDasharray={452} 
                                                strokeDashoffset={452 - (452 * studentData.actualAttendance) / 100}
                                                strokeLinecap="round" className={`${studentData.actualAttendance < 75 ? 'text-red-500' : 'text-green-500'} transition-all duration-1000`} />
                                    </svg>
                                    <span className="absolute text-4xl font-black text-slate-800">{studentData.actualAttendance}%</span>
                                </div>
                            </div>

                            {/* Academic Details */}
                            <div className="bg-indigo-600 text-white p-8 rounded-[40px] shadow-lg flex flex-col justify-between">
                                <div>
                                    <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4"><BookOpen size={24} /></div>
                                    <h3 className="text-2xl font-black mb-1">{studentData.fullName}</h3>
                                    <p className="text-indigo-100 opacity-80 text-sm font-medium">Roll No: {studentData.rollNo}</p>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                                    <p className="text-sm font-bold uppercase tracking-tight">Current Subject</p>
                                    <p className="text-lg text-indigo-200">{studentData.subject}</p>
                                </div>
                            </div>
                        </div>

                        {/* Mentor Information */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                            <h3 className="text-slate-800 font-black text-xl mb-6 flex items-center gap-2">
                                <User className="text-indigo-600" size={20}/> Mentor Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl">
                                    <div className="bg-white p-3 rounded-2xl text-indigo-600 shadow-sm"><User size={20}/></div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Name</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{menteeDetails?.name || "Assigning..."}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl">
                                    <div className="bg-white p-3 rounded-2xl text-indigo-600 shadow-sm"><Phone size={20}/></div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Mobile</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{menteeDetails?.mobile || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl">
                                    <div className="bg-white p-3 rounded-2xl text-indigo-600 shadow-sm"><Mail size={20}/></div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{menteeDetails?.email || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-10">
                            <ChatWindow recipientName={menteeDetails?.name} recipientId={menteeDetails?.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;