import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api'; 
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Zap, MessageSquare } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authAPI.login(formData);
            login(data); 
            const userRole = data?.user?.role?.toLowerCase();

            if (userRole === 'mentor') {
                navigate('/mentee/dashboard');
            } else if (userRole === 'parent') {
                navigate('/parent/dashboard');
            } else {
                navigate('/unauthorized'); 
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Invalid Email or Password.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
            {/* Left Side: Dynamic Branding Section */}
            <div className="hidden lg:flex w-7/12 relative bg-indigo-700 overflow-hidden items-center justify-center p-16">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

                <div className="relative z-10 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
                        </span>
                        New Version 2.0
                    </div>
                    
                    <h1 className="text-6xl font-black mb-6 text-white tracking-tight">
                        Mentor<span className="text-indigo-300">Portal</span>
                    </h1>
                    
                    <p className="text-indigo-100 text-xl leading-relaxed mb-10 opacity-90">
                        Bridging the gap between education and guidance. Experience the next generation of student performance tracking.
                    </p>

                    <div className="grid gap-6">
                        {[
                            { icon: <Zap className="size-5" />, title: "Instant Sync", desc: "Attendance updates mirrored instantly." },
                            { icon: <MessageSquare className="size-5" />, title: "Direct Line", desc: "Chat directly with assigned mentors." },
                            { icon: <ShieldCheck className="size-5" />, title: "Secure Access", desc: "Enterprise-grade data protection." }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-default">
                                <div className="p-2.5 bg-indigo-400/20 rounded-xl text-indigo-200 border border-indigo-400/20">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{item.title}</h4>
                                    <p className="text-indigo-200/70 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Clean Form Section */}
            <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                        <p className="text-slate-500 mt-3 font-medium text-lg">Enter your details to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="text-sm font-bold text-slate-700 ml-1 group-focus-within:text-indigo-600 transition-colors">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    type="email" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-700 group-focus-within:text-indigo-600 transition-colors">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    type="password" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-4.5 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl shadow-slate-200 disabled:opacity-70 mt-4 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    <span>Sign in to Portal</span> 
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-100">
                        <p className="text-center text-slate-500 font-medium">
                            New to the platform?{' '}
                            <Link to="/signup" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors inline-flex items-center gap-1 group">
                                Create an account
                                <span className="block h-px w-0 group-hover:w-full bg-indigo-600 transition-all duration-300"></span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;