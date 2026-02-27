import React from 'react';
import { Lock, CheckCircle, Calendar, FileText, ArrowRight, X } from 'lucide-react';
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

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center filter blur-sm"></div>
                <div className="relative z-10 max-w-lg bg-slate-900/90 backdrop-blur-xl border border-yellow-500/30 p-10 rounded-2xl text-center shadow-2xl">
                    
                    {/* Close Button */}
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

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Fleet Command Center</h2>
                        <p className="text-slate-400">Enterprise Resource Planning • Nairobi Region</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2 rounded flex items-center"><Calendar size={16} className="mr-2"/> Oct 2023</button>
                        <button className="bg-yellow-500 text-slate-900 px-4 py-2 rounded font-bold flex items-center"><FileText size={16} className="mr-2"/> Export Report</button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Total Fleet Value</div>
                        <div className="text-2xl font-bold text-white">KES 142.5M</div>
                        <div className="text-green-500 text-xs mt-2 flex items-center"><ArrowRight size={12} className="rotate-45 mr-1"/> +2.4% vs last month</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Monthly Fuel Cost</div>
                        <div className="text-2xl font-bold text-white">KES 840K</div>
                        <div className="text-red-500 text-xs mt-2 flex items-center"><ArrowRight size={12} className="rotate-45 mr-1"/> +12% due to price hike</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Active Maintenance</div>
                        <div className="text-2xl font-bold text-white">3 Units</div>
                        <div className="text-yellow-500 text-xs mt-2">2 Critical</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Fleet Utilization</div>
                        <div className="text-2xl font-bold text-white">88%</div>
                        <div className="text-green-500 text-xs mt-2">Optimal Range</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-white font-bold mb-6">Operational Costs (6 Months)</h3>
                        <CostChart />
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-white font-bold mb-6">Fleet Status Distribution</h3>
                        <FleetStatusChart />
                    </div>
                </div>

                {/* Recent Logs Table */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-white font-bold">Recent Operator Logs</h3>
                        <button className="text-yellow-500 text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-950">
                                <tr>
                                    <th className="px-6 py-3">Log ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Operator</th>
                                    <th className="px-6 py-3">Machine</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-mono text-xs text-white">{log.id}</td>
                                        <td className="px-6 py-4">{log.date}</td>
                                        <td className="px-6 py-4">{log.operatorName}</td>
                                        <td className="px-6 py-4 font-bold">{log.machineId}</td>
                                        <td className="px-6 py-4">{log.location}</td>
                                        <td className="px-6 py-4">
                                            {/* AI INJECTED LOGIC: Check if checklist is perfect */}
                                            {Object.values(log.checklist).every(v => v) ? (
                                                <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                                                    CLEARED
                                                </span>
                                            ) : (
                                                <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
                                                    MAINTENANCE REQ
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            No operator logs submitted yet.
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