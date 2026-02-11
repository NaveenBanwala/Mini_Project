import React, { useState } from 'react';
import { User, Mail, Lock, Calendar, Phone, Save, Loader2, Building2, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../services/api';

const ProfileSettings = ({ user, onUpdateSuccess, onBackToDashboard }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        mobileNo: user?.mobileNo || '', 
        academicYear: user?.academicYear || '2024-25',
        department: user?.department || '',
        password: '' 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const response = await authAPI.updateProfile(formData);
            setSuccess(true);
            
            // Update the global user state
            if (onUpdateSuccess) onUpdateSuccess(response.data.user);
            
            // Wait 2 seconds so the user see the success message, then return to dashboard
            setTimeout(() => {
                if (onBackToDashboard) onBackToDashboard();
            }, 2000);

        } catch (err) {
            alert(err.response?.data?.error || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden transition-all">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Account Settings</h3>
                    <p className="text-slate-500 text-sm font-medium">Update your professional details and security</p>
                </div>
                {success && (
                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-full animate-bounce">
                        <CheckCircle2 size={18} />
                        Saved! Returning to Dashboard...
                    </div>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                name="username" 
                                placeholder="e.g. Naveen Banawla"
                                value={formData.username} 
                                onChange={handleChange} 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" 
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="kiit@university.edu"
                                value={formData.email} 
                                onChange={handleChange} 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" 
                            />
                        </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                name="mobileNo" 
                                placeholder="+91 9518147540"
                                value={formData.mobileNo} 
                                onChange={handleChange} 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" 
                            />
                        </div>
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Department</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                name="department" 
                                placeholder="e.g. Computer Science"
                                value={formData.department} 
                                onChange={handleChange} 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" 
                            />
                        </div>
                    </div>

                    {/* Academic Year */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Academic Year</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                name="academicYear" 
                                placeholder="2024-25"
                                value={formData.academicYear} 
                                onChange={handleChange} 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" 
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Change Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                name="password" 
                                type="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="Leave blank to keep current" 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300" 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        type="button"
                        onClick={onBackToDashboard}
                        className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading || success}
                        className={`flex-[2] py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg ${
                            success 
                            ? 'bg-green-500 text-white shadow-green-100' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                        }`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Save size={20} />}
                        {success ? "Changes Saved!" : "Save Profile Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;