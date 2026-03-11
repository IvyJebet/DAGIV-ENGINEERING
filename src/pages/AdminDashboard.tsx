import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, Activity, Users, Settings } from 'lucide-react';
import { SupportTicketingSystem } from '@/components/SupportTicketingSystem';

export const AdminDashboard = () => {
    const { user, token } = useAuth();

    // Route Protection: Kick unauthorized users out
    if (!token) {
        return <Navigate to="/" />;
    }
    
    // FIX: Safely convert role to uppercase to prevent case-sensitivity bugs
    const userRole = user?.role?.toUpperCase();
    if (userRole !== 'ADMIN' && userRole !== 'SUPPORT') {
        return <Navigate to="/buyer/dashboard" />; 
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* Admin Header */}
                <div className="mb-8 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="text-yellow-500" size={36} />
                        <h1 className="text-3xl font-black text-white">Admin Command Center</h1>
                        <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider border border-purple-500/30 ml-2">
                            STAFF ONLY
                        </span>
                    </div>
                    <p className="text-slate-400">Manage platform operations, verify sellers, and resolve customer support tickets.</p>
                </div>

                {/* Admin Navigation Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar">
                    <button className="bg-yellow-500 text-slate-900 px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg flex items-center">
                        <Activity size={16} className="mr-2" /> Support Desk
                    </button>
                    <button className="bg-slate-900 text-slate-400 border border-slate-800 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center hover:text-white transition-colors cursor-not-allowed opacity-50">
                        <Users size={16} className="mr-2" /> User Management
                    </button>
                    <button className="bg-slate-900 text-slate-400 border border-slate-800 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center hover:text-white transition-colors cursor-not-allowed opacity-50">
                        <Settings size={16} className="mr-2" /> System Config
                    </button>
                </div>

                {/* The Support System will automatically show the Agent view because of the userRole check inside its own logic */}
                <SupportTicketingSystem />
                
            </div>
        </div>
    );
};