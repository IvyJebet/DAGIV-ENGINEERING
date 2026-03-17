import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
    ShieldCheck, Activity, Users, Settings, Search, 
    CheckCircle, Ban, Eye, TrendingUp, DollarSign, 
    Package, AlertCircle, Loader2
} from 'lucide-react';
import { SupportTicketingSystem } from '@/components/SupportTicketingSystem';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ============================================================================
// --- SUB-COMPONENT: USER MANAGEMENT ---
// ============================================================================
const UserManagementTab = ({ token }: { token: string }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Attempt to fetch real users, fallback to mock data if backend isn't ready
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${API_URL}/api/admin/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setUsers(await res.json());
                } else {
                    throw new Error("Backend endpoint not ready");
                }
            } catch (e) {
                // Enterprise Mock Data
                setUsers([
                    { id: '1', username: 'CaterpillarEA', email: 'sales@cateastafrica.com', role: 'SELLER', status: 'PENDING', joined: '2026-03-15' },
                    { id: '2', username: 'MombasaConstruct', email: 'procurement@mombasac.co.ke', role: 'BUYER', status: 'ACTIVE', joined: '2026-03-10' },
                    { id: '3', username: 'HeavyDutySpares', email: 'parts@heavyduty.com', role: 'SELLER', status: 'VERIFIED', joined: '2026-02-28' },
                    { id: '4', username: 'FraudUser99', email: 'scammer@fake.com', role: 'BUYER', status: 'BANNED', joined: '2026-03-01' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'VERIFIED': return <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold tracking-wider">VERIFIED</span>;
            case 'ACTIVE': return <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-1 rounded text-[10px] font-bold tracking-wider">ACTIVE</span>;
            case 'PENDING': return <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded text-[10px] font-bold tracking-wider">PENDING KYC</span>;
            case 'BANNED': return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-[10px] font-bold tracking-wider">BANNED</span>;
            default: return null;
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in">
            <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex flex-wrap gap-4 justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center"><Users className="mr-3 text-[#DD9C00]" /> User & KYC Management</h2>
                    <p className="text-sm text-slate-400 mt-1">Review seller documents, verify identities, and manage platform access.</p>
                </div>
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="text" placeholder="Search users by email..." className="bg-slate-950 border border-slate-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:border-[#DD9C00] outline-none w-64" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/80 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                        <tr>
                            <th className="p-4 pl-6">User / Business</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Joined Date</th>
                            <th className="p-4 text-right pr-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto" /></td></tr>
                        ) : users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 pl-6">
                                    <div className="font-bold text-slate-200">{u.username}</div>
                                    <div className="text-xs text-slate-500">{u.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-black tracking-widest uppercase ${u.role === 'SELLER' ? 'text-purple-400' : 'text-blue-400'}`}>{u.role}</span>
                                </td>
                                <td className="p-4">{getStatusBadge(u.status)}</td>
                                <td className="p-4 text-slate-400">{u.joined}</td>
                                <td className="p-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors" title="View Profile"><Eye size={16} /></button>
                                        {u.status === 'PENDING' && (
                                            <button className="p-2 text-emerald-500 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 rounded-lg transition-colors border border-emerald-500/20" title="Verify Seller"><CheckCircle size={16} /></button>
                                        )}
                                        {u.status !== 'BANNED' && (
                                            <button className="p-2 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors border border-red-500/20" title="Ban User"><Ban size={16} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ============================================================================
// --- SUB-COMPONENT: SYSTEM CONFIG ---
// ============================================================================
const SystemConfigTab = () => {
    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#283B0A] border border-[#3a5212] p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10"><DollarSign size={100} /></div>
                    <h3 className="text-slate-300 text-xs font-black uppercase tracking-widest mb-1">Total Escrow Volume</h3>
                    <p className="text-3xl font-black text-white">KES 14.2M</p>
                    <div className="mt-4 flex items-center text-emerald-400 text-xs font-bold"><TrendingUp size={14} className="mr-1" /> +12.5% this month</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Platform Revenue (5% Cut)</h3>
                    <p className="text-3xl font-black text-[#DD9C00]">KES 710,000</p>
                    <div className="mt-4 flex items-center text-emerald-500 text-xs font-bold"><TrendingUp size={14} className="mr-1" /> Available for Payout</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Active Machinery Listings</h3>
                    <p className="text-3xl font-black text-white">342</p>
                    <div className="mt-4 flex items-center text-slate-400 text-xs font-bold"><Package size={14} className="mr-1" /> Across 45 Verified Sellers</div>
                </div>
            </div>

            {/* Config Toggles */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8">
                <h2 className="text-xl font-black text-white mb-6 flex items-center"><Settings className="mr-3 text-[#DD9C00]" /> Global Platform Settings</h2>
                
                <div className="space-y-6 max-w-2xl">
                    {/* Setting 1 */}
                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        <div>
                            <h4 className="text-white font-bold text-sm">Escrow Commission Rate (%)</h4>
                            <p className="text-xs text-slate-500 mt-1">The percentage cut DAGIV takes from successful sales.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* FIXED: Added aria-label */}
                            <input aria-label="Escrow Commission Rate (%)" type="number" defaultValue="5.0" className="bg-slate-900 border border-slate-700 text-white text-center w-20 py-2 rounded-lg focus:border-[#DD9C00] outline-none font-mono" />
                            <button className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors">Save</button>
                        </div>
                    </div>

                    {/* Setting 2 */}
                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        <div>
                            <h4 className="text-white font-bold text-sm">Require Manual Seller KYC</h4>
                            <p className="text-xs text-slate-500 mt-1">If active, sellers cannot list items until an admin verifies their KRA pin.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            {/* FIXED: Added aria-label */}
                            <input aria-label="Require Manual Seller KYC" type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>

                    {/* Setting 3 */}
                    <div className="flex items-center justify-between p-4 border border-red-900/30 bg-red-500/5 rounded-xl">
                        <div>
                            <h4 className="text-red-400 font-bold text-sm flex items-center"><AlertCircle size={16} className="mr-2"/> Maintenance Mode</h4>
                            <p className="text-xs text-red-400/70 mt-1">Stops all new checkouts and logins. Only admins can access the platform.</p>
                        </div>
                        <button className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 px-4 py-2 rounded-lg text-xs font-bold transition-all">Enable Maintenance</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// --- MAIN ADMIN DASHBOARD COMPONENT ---
// ============================================================================
export const AdminDashboard = () => {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState<'SUPPORT' | 'USERS' | 'CONFIG'>('SUPPORT');

    // Route Protection: Kick unauthorized users out
    if (!token) {
        return <Navigate to="/" />;
    }
    
    // Safely convert role to uppercase to prevent case-sensitivity bugs
    const userRole = user?.role?.toUpperCase();
    if (userRole !== 'ADMIN' && userRole !== 'SUPPORT') {
        return <Navigate to="/buyer/dashboard" />; 
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-2 sm:px-4">
            <div className="max-w-[1400px] mx-auto">
                
                {/* Admin Header */}
                <div className="mb-8 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="text-[#DD9C00]" size={36} />
                        <h1 className="text-3xl font-black text-white">Admin Command Center</h1>
                        <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider border border-purple-500/30 ml-2">
                            STAFF ONLY
                        </span>
                    </div>
                    <p className="text-slate-400">Manage platform operations, verify sellers, and resolve customer support tickets.</p>
                </div>

                {/* Admin Navigation Tabs */}
                <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
                    <button 
                        onClick={() => setActiveTab('SUPPORT')}
                        className={`px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg flex items-center transition-all ${activeTab === 'SUPPORT' ? 'bg-[#DD9C00] text-slate-900' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Activity size={16} className="mr-2" /> Support Desk
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('USERS')}
                        className={`px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg flex items-center transition-all ${activeTab === 'USERS' ? 'bg-[#DD9C00] text-slate-900' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Users size={16} className="mr-2" /> User Management
                    </button>
                    
                    {/* Only show System Config if role is strictly ADMIN, hide from SUPPORT agents */}
                    {userRole === 'ADMIN' && (
                        <button 
                            onClick={() => setActiveTab('CONFIG')}
                            className={`px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg flex items-center transition-all ${activeTab === 'CONFIG' ? 'bg-[#DD9C00] text-slate-900' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'}`}
                        >
                            <Settings size={16} className="mr-2" /> System Config
                        </button>
                    )}
                </div>

                {/* Dynamic Content Rendering */}
                <div className="w-full">
                    <div className="mb-4">
                        <h1 className="text-xl font-bold text-white mb-2">Platform Overview</h1>
                    </div>
                    {activeTab === 'SUPPORT' && <SupportTicketingSystem />}
                    {activeTab === 'USERS' && <UserManagementTab token={token} />}
                    {activeTab === 'CONFIG' && <SystemConfigTab />}
                </div>
                
            </div>
        </div>
    );
};