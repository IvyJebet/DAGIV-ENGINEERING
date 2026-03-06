import React from 'react';
import { Lock, CheckCircle, Calendar, FileText, ArrowRight, X, UserCircle, LogIn, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OperatorLog } from '@/types';
import { CostChart, FleetStatusChart } from '../Widgets';

interface ERPDashboardProps {
  hasAccess: boolean;
  onSubscribe: () => void;
  logs: OperatorLog[];
}

export const ERPDashboard: React.FC<ERPDashboardProps> = ({ hasAccess, onSubscribe, logs }) => {
    const navigate = useNavigate();

    // 1. RESTRICTED ACCESS VIEW
    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center filter blur-sm"></div>
                <div className="relative z-10 max-w-lg bg-slate-900/90 backdrop-blur-xl border border-yellow-500/30 p-10 rounded-2xl text-center shadow-2xl">
                    
                    <button 
                        onClick={() => navigate('/')} 
                        className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 transition-colors"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>

                    <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                        <Lock size={32} className="text-slate-900" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4">RESTRICTED ACCESS</h2>
                    <p className="text-slate-300 mb-8">The DAGIV Fleet ERP is a premium enterprise tool for fleet managers. Monitor fuel, track assets, and predict maintenance costs.</p>
                    <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                        <div className="flex items-center text-slate-400"><CheckCircle size={16} className="text-yellow-500 mr-2"/> Real-time Telemetry</div>
                        <div className="flex items-center text-slate-400"><CheckCircle size={16} className="text-yellow-500 mr-2"/> Driver Performance Scorecards</div>
                        <div className="flex items-center text-slate-400"><CheckCircle size={16} className="text-yellow-500 mr-2"/> Automated Expense Reports</div>
                    </div>
                    <button onClick={onSubscribe} className="w-full py-4 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg">
                        REQUEST ACCESS DEMO
                    </button>
                </div>
            </div>
        );
    }

    // 2. ACTIVE ERP DASHBOARD VIEW
    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section with New Operator Login Tab */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-white tracking-tight">Fleet Command Center</h2>
                            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest">Enterprise</span>
                        </div>
                        <p className="text-slate-400">Resource Planning & Asset Analytics • Nairobi Hub</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* THE NEW OPERATOR LOGIN TAB */}
                        <button 
                            onClick={() => window.dispatchEvent(new Event('openOperatorPortal'))}
                            className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all border border-slate-700 flex items-center justify-center gap-2 group"
                        >
                            <UserCircle size={18} className="text-yellow-500 group-hover:scale-110 transition-transform"/>
                            <span>OPERATOR LOGIN</span>
                        </button>

                        <button className="hidden sm:flex bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg items-center text-sm font-medium hover:bg-slate-800 transition-colors">
                            <Calendar size={16} className="mr-2 text-slate-500"/> Oct 2023
                        </button>

                        <button className="flex-1 md:flex-none bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10">
                            <FileText size={18} /> 
                            <span>EXPORT REPORT</span>
                        </button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2 tracking-wider">Total Fleet Value</div>
                        <div className="text-2xl font-black text-white italic">KES 142.5M</div>
                        <div className="text-green-500 text-xs mt-2 flex items-center font-medium">
                            <ArrowRight size={12} className="-rotate-45 mr-1"/> +2.4% vs last month
                        </div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2 tracking-wider">Monthly Fuel Cost</div>
                        <div className="text-2xl font-black text-white italic">KES 840K</div>
                        <div className="text-red-500 text-xs mt-2 flex items-center font-medium">
                            <ArrowRight size={12} className="rotate-45 mr-1"/> +12% price hike
                        </div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2 tracking-wider">Active Maintenance</div>
                        <div className="text-2xl font-black text-white italic">3 Units</div>
                        <div className="text-yellow-500 text-xs mt-2 font-medium">2 Critical items</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2 tracking-wider">Fleet Utilization</div>
                        <div className="text-2xl font-black text-white italic">88%</div>
                        <div className="text-green-500 text-xs mt-2 font-medium">Optimal operational range</div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-inner">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest text-slate-400">Operational Costs (6 Months)</h3>
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                        </div>
                        <CostChart />
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-inner">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest text-slate-400">Fleet Status Distribution</h3>
                            <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                        </div>
                        <FleetStatusChart />
                    </div>
                </div>

                {/* Recent Logs Table */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                        <div>
                            <h3 className="text-white font-bold">Recent Operator Logs</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tighter">Real-time field submissions</p>
                        </div>
                        <button className="text-yellow-500 text-xs font-black uppercase tracking-widest hover:text-yellow-400 transition-colors border-b border-yellow-500/20 pb-1">View All Logs</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/80 font-black tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 text-yellow-500/50">Log ID</th>
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Personnel</th>
                                    <th className="px-6 py-4">Asset ID</th>
                                    <th className="px-6 py-4">Site Location</th>
                                    <th className="px-6 py-4 text-center">Health Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-white opacity-70 group-hover:opacity-100">{log.id}</td>
                                        <td className="px-6 py-4 text-xs font-medium">{log.date}</td>
                                        <td className="px-6 py-4 font-bold text-slate-200">{log.operatorName}</td>
                                        <td className="px-6 py-4"><span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-yellow-500 border border-slate-700">{log.machineId}</span></td>
                                        <td className="px-6 py-4 text-xs">{log.location}</td>
                                        <td className="px-6 py-4 text-center">
                                            {Object.values(log.checklist).every(v => v) ? (
                                                <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[10px] font-black border border-emerald-500/20 uppercase">
                                                    SYSTEMS OK
                                                </span>
                                            ) : (
                                                <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-[10px] font-black border border-red-500/20 uppercase">
                                                    MAINTENANCE REQ
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-slate-600 italic font-medium">
                                            <div className="flex flex-col items-center gap-2">
                                                <Activity size={32} className="opacity-20 mb-2"/>
                                                <span>No field logs detected in the Nairobi hub for this period.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};