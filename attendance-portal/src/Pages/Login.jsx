import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api'; 
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            console.log("Attempting login for:", formData.email);
            
            // 1. Execute login request
            const { data } = await authAPI.login(formData);
            
            // 2. Save user/token to Context/Localstorage
            // data should be { token: "...", user: { id: 1, role: "parent", ... } }
            login(data); 

            // 3. Role-based redirection
            // Use optional chaining (?.) to prevent "undefined" crashes
            const userRole = data?.user?.role?.toLowerCase();
            
            console.log("Login successful! Role:", userRole);

            if (userRole === 'mentor') {
                navigate('/mentee/dashboard');
            } else if (userRole === 'parent') {
                navigate('/parent/dashboard');
            } else {
                console.warn("Unknown role detected:", userRole);
                navigate('/unauthorized'); 
            }

        } catch (err) {
            console.error("Login Error Details:", err);
            const errorMessage = err.response?.data?.message || "Invalid Email or Password.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side: Branding */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 items-center justify-center p-12 text-white">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold mb-6 italic">MentorPortal.</h1>
                    <p className="text-indigo-100 text-lg mb-8">
                        The dedicated portal for Parents and Mentees to track student progress and maintain direct communication.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-500 p-2 rounded-lg">✅</div>
                            <p>Real-time Attendance Sync</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-500 p-2 rounded-lg">✅</div>
                            <p>Direct Parent-Mentee Messaging</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                        <p className="text-slate-500 mt-2">Log in with your registered email.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-slate-400 size-5" />
                                <input 
                                    type="email" 
                                    required
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="parent@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400 size-5" />
                                <input 
                                    type="password" 
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-600">
                        Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;