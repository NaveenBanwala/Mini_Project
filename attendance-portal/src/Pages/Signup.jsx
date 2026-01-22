import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api'; 
import { User, Mail, Lock, ChevronDown, Loader2, Hash } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',      // Matches Backend User.name
        email: '', 
        password: '', 
        role: 'parent',
        rollNo: ''     // Required for linking to Student table
    });
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Basic validation for Parent
        if (formData.role === 'parent' && !formData.rollNo) {
            alert("Please enter your child's Roll Number");
            setLoading(false);
            return;
        }

        try {
            await authAPI.signup(formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            console.error("Signup Error:", err.response?.data);
            alert(err.response?.data?.message || "Signup failed. Ensure all fields are filled.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl border border-slate-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-800">Create Account</h2>
                    <p className="text-slate-500 mt-2">Join as a Parent or Mentor to get started.</p>
                </div>

                <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Full Name - Fixed from 'username' to 'name' */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400 size-5" />
                            <input 
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Account Role</label>
                        <div className="relative">
                            <select 
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                value={formData.role}
                            >
                                <option value="parent">Parent</option>
                                <option value="mentor">Mentor (Admin)</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-slate-400 size-5 pointer-events-none" />
                        </div>
                    </div>

                    {/* Roll Number - Only visible if Parent is selected */}
                    {formData.role === 'parent' && (
                        <div className="md:col-span-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-bold text-indigo-600">Child's Roll Number (Required)</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3.5 text-indigo-400 size-5" />
                                <input 
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.rollNo}
                                    onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                                    placeholder="e.g. 23052251"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email Address (Login ID)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-400 size-5" />
                            <input 
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-slate-700">Create Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-slate-400 size-5" />
                            <input 
                                type="password"
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="At least 6 characters"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="md:col-span-2 bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-xl flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Register Account"}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-600">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;