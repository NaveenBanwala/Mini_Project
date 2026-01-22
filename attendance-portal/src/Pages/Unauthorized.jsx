import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <ShieldAlert size={80} className="text-red-500 mb-6" />
            <h1 className="text-4xl font-black text-slate-800 mb-2">Access Denied</h1>
            <p className="text-slate-500 max-w-md mb-8">
                You do not have the required permissions to view this page. Please contact the administrator if you believe this is an error.
            </p>
            <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all"
            >
                <ArrowLeft size={18} /> Back to Login
            </button>
        </div>
    );
};

export default Unauthorized;