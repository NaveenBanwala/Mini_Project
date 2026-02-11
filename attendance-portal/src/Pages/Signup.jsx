
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api'; 
import { User, Mail, Lock, ChevronDown, Loader2, Hash, ArrowRight, ShieldCheck, Phone, GraduationCap, Building2 } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '', 
        password: '', 
        role: 'parent',
        rollNo: '',
        mobileNo: '',      // New Field
        academicYear: '',   // New Field
        department: ''      // New Field
    });
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Validation Logic
        if (formData.role === 'parent' && !formData.rollNo) {
            alert("Please enter your child's Roll Number");
            setLoading(false);
            return;
        }

        if (formData.role === 'mentor' && (!formData.academicYear || !formData.department)) {
            alert("Mentors must provide Academic Year and Department");
            setLoading(false);
            return;
        }

        try {
            await authAPI.signup(formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed. Ensure all fields are filled.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* Side Info */}
                <div className="hidden md:flex w-1/3 bg-indigo-600 p-8 text-white flex-col justify-between">
                    <div>
                        <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="size-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold leading-tight">Secure Registration</h3>
                        <p className="text-indigo-100 text-sm mt-2 opacity-80">Join our community to track progress and stay connected.</p>
                    </div>
                    <div className="text-xs text-indigo-200">© 2026 MentorPortal System</div>
                </div>

                {/* Form Section */}
                <div className="flex-1 p-8 sm:p-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-900">Create Account</h2>
                        <p className="text-slate-500 mt-2 font-medium">Complete your profile details.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Mobile Number */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Mobile No</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        required
                                        type="tel"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800"
                                        value={formData.mobileNo}
                                        onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Account Role</label>
                            <div className="relative group">
                                <select 
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer font-bold text-indigo-600"
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    value={formData.role}
                                >
                                    <option value="parent">Parent</option>
                                    <option value="mentor">Mentor (Admin)</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 pointer-events-none" />
                            </div>
                        </div>

                        {/* CONDITIONAL FIELDS */}
                        {formData.role === 'parent' ? (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 ml-1">Child's Roll Number</label>
                                <div className="relative group">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 size-5" />
                                    <input 
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-800"
                                        value={formData.rollNo}
                                        onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                                        placeholder="e.g. 23052251"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 ml-1">Academic Year</label>
                                    <div className="relative group">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 size-5" />
                                        <input 
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl transition-all font-bold text-slate-800"
                                            value={formData.academicYear}
                                            onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                                            placeholder="2024-25"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 ml-1">Department</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 size-5" />
                                        <input 
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl transition-all font-bold text-slate-800"
                                            value={formData.department}
                                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                                            placeholder="CSE / IT"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-indigo-500" />
                                <input 
                                    type="email" required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Create Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-indigo-500" />
                                <input 
                                    type="password" required minLength={6}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><span>Register Account</span><ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-500 font-medium">Joined us before? <Link to="/login" className="text-indigo-600 font-black hover:text-indigo-700">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { authAPI } from '../services/api'; 
// import { User, Mail, Lock, ChevronDown, Loader2, Hash, ArrowRight, ShieldCheck } from 'lucide-react';

// const Signup = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '', 
//         password: '', 
//         role: 'parent',
//         rollNo: '' 
//     });
    
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleSignup = async (e) => {
//         e.preventDefault();
//         setLoading(true);
        
//         if (formData.role === 'parent' && !formData.rollNo) {
//             alert("Please enter your child's Roll Number");
//             setLoading(false);
//             return;
//         }

//         try {
//             await authAPI.signup(formData);
//             alert("Registration successful! Please login.");
//             navigate('/login');
//         } catch (err) {
//             alert(err.response?.data?.message || "Signup failed. Ensure all fields are filled.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-8 font-sans">
//             {/* Main Card */}
//             <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                
//                 {/* Side Info (Hidden on Mobile) */}
//                 <div className="hidden md:flex w-1/3 bg-indigo-600 p-8 text-white flex-col justify-between">
//                     <div>
//                         <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-6">
//                             <ShieldCheck className="size-6 text-white" />
//                         </div>
//                         <h3 className="text-xl font-bold leading-tight">Secure Registration</h3>
//                         <p className="text-indigo-100 text-sm mt-2 opacity-80">Join our community to track progress and stay connected.</p>
//                     </div>
//                     <div className="text-xs text-indigo-200">
//                         © 2026 MentorPortal System
//                     </div>
//                 </div>

//                 {/* Form Section */}
//                 <div className="flex-1 p-8 sm:p-12">
//                     <div className="mb-8">
//                         <h2 className="text-3xl font-black text-slate-900">Create Account</h2>
//                         <p className="text-slate-500 mt-2 font-medium">Get started by choosing your role.</p>
//                     </div>

//                     <form onSubmit={handleSignup} className="space-y-5">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                             {/* Full Name */}
//                             <div className="space-y-2">
//                                 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
//                                 <div className="relative group">
//                                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-indigo-500 transition-colors" />
//                                     <input 
//                                         required
//                                         className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800"
//                                         value={formData.name}
//                                         onChange={(e) => setFormData({...formData, name: e.target.value})}
//                                         placeholder="John Doe"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Role Selection */}
//                             <div className="space-y-2">
//                                 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Account Role</label>
//                                 <div className="relative group">
//                                     <select 
//                                         className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer font-bold text-indigo-600"
//                                         onChange={(e) => setFormData({...formData, role: e.target.value})}
//                                         value={formData.role}
//                                     >
//                                         <option value="parent">Parent</option>
//                                         <option value="mentor">Mentor (Admin)</option>
//                                     </select>
//                                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 pointer-events-none" />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Roll Number - Animated Appearance */}
//                         {formData.role === 'parent' && (
//                             <div className="space-y-2 transition-all duration-500 animate-in slide-in-from-left-4 fade-in">
//                                 <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 ml-1">Child's Roll Number</label>
//                                 <div className="relative group">
//                                     <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 size-5 group-focus-within:text-indigo-500" />
//                                     <input 
//                                         required
//                                         className="w-full pl-12 pr-4 py-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
//                                         value={formData.rollNo}
//                                         onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
//                                         placeholder="e.g. 23052251"
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Email */}
//                         <div className="space-y-2">
//                             <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
//                             <div className="relative group">
//                                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-indigo-500 transition-colors" />
//                                 <input 
//                                     type="email"
//                                     required
//                                     className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800"
//                                     value={formData.email}
//                                     onChange={(e) => setFormData({...formData, email: e.target.value})}
//                                     placeholder="name@example.com"
//                                 />
//                             </div>
//                         </div>

//                         {/* Password */}
//                         <div className="space-y-2">
//                             <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Create Password</label>
//                             <div className="relative group">
//                                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-indigo-500 transition-colors" />
//                                 <input 
//                                     type="password"
//                                     required
//                                     minLength={6}
//                                     className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800"
//                                     value={formData.password}
//                                     onChange={(e) => setFormData({...formData, password: e.target.value})}
//                                     placeholder="Min. 6 characters"
//                                 />
//                             </div>
//                         </div>

//                         <button 
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 mt-4"
//                         >
//                             {loading ? (
//                                 <Loader2 className="animate-spin" />
//                             ) : (
//                                 <>
//                                     <span>Register Account</span>
//                                     <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
//                                 </>
//                             )}
//                         </button>
//                     </form>

//                     <div className="mt-8 pt-6 border-t border-slate-100 text-center">
//                         <p className="text-slate-500 font-medium">
//                             Joined us before?{' '}
//                             <Link to="/login" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors">
//                                 Sign In
//                             </Link>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Signup;