
import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from './components/Layout';
import { PageView, UserRole, OperatorLog, EquipmentItem, SparePart, MaintenanceTask, Alert, ProfessionalProfile } from './types';
import { EQUIPMENT_DATA, SERVICES_CONTENT, SPARE_PARTS, PROFESSIONALS } from './constants';
import { CostChart, FleetStatusChart, UptimeChart } from './components/Widgets';
import { 
  CheckCircle, ChevronRight, Truck, Wrench, ShieldCheck, MapPin, 
  Search, Filter, Lock, AlertTriangle, User, FileText, Droplet, 
  Phone, MessageSquare, Briefcase, Star, ShoppingCart, Info, X, Activity,
  Calendar, Clock, DollarSign, Tag, Check, CreditCard, LogOut, BarChart3, Settings, Users,
  ClipboardCheck, Navigation, Flame, Key, Bell, FileBarChart, Siren, PenTool, RefreshCw, BadgeCheck, HardHat, FileBadge, ArrowRight, Trash2,
  FileSpreadsheet, Download, ChevronDown, List, Grid, UserCheck, Shield, Thermometer
} from 'lucide-react';
import { generateEngineeringAdvice } from './services/geminiService';

// --- MOCK DATA ---
const INITIAL_LOGS: OperatorLog[] = [
    {
        id: 'LOG-1002', machineId: 'e1', operatorName: 'John Kamau', date: '2023-10-25',
        startTime: '08:00', endTime: '16:30', startOdometer: 4500, endOdometer: 4508,
        fuelAddedLiters: 0, location: 'Nairobi Expressway Site',
        checklist: { tires: true, oil: true, hydraulics: true, brakes: true },
        notes: 'Routine operation. Hydraulic fluid top-up required soon.'
    },
    {
        id: 'LOG-1001', machineId: 'log1', operatorName: 'Samuel Ochieng', date: '2023-10-24',
        startTime: '07:30', endTime: '18:00', startOdometer: 12400, endOdometer: 12650,
        fuelAddedLiters: 150, location: 'Mombasa Road Transport',
        checklist: { tires: true, oil: true, hydraulics: true, brakes: false },
        notes: 'Brake pads worn out. Reported to maintenance.'
    }
];

const INITIAL_MAINTENANCE_TASKS = [
    { id: 'MT-1', machine: 'CAT 336D2 (KCD 892)', task: '500hr Service', status: 'Overdue', date: '2023-10-20', priority: 'High' },
    { id: 'MT-2', machine: 'Sinotruk Tipper', task: 'Brake Pad Replacement', status: 'Pending', date: '2023-10-28', priority: 'Medium' },
    { id: 'MT-3', machine: 'Komatsu Dozer', task: 'Undercarriage Inspection', status: 'Completed', date: '2023-10-15', priority: 'Low' },
];

// --- MISSING COMPONENT IMPLEMENTATIONS ---

const ServicesPage = ({ setPage }: { setPage: (p: PageView) => void }) => (
  <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Our Engineering Services</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">From procurement to maintenance, we handle the entire lifecycle of your heavy machinery.</p>
          </div>
          <div className="space-y-20">
              {SERVICES_CONTENT.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                      <div key={service.id} className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                          <div className="flex-1">
                              <img src={service.image} alt={service.title} className="rounded-xl shadow-2xl border border-slate-800" />
                          </div>
                          <div className="flex-1 space-y-6">
                              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-yellow-500 border border-slate-700">
                                  <Icon size={32} />
                              </div>
                              <h3 className="text-3xl font-bold text-white">{service.title}</h3>
                              <p className="text-slate-300 text-lg leading-relaxed">{service.fullDesc}</p>
                              
                              <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                                  <h4 className="text-yellow-500 font-bold uppercase text-xs mb-4">Our Process</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                      {service.process.map((step, i) => (
                                          <div key={i} className="flex items-center text-slate-400 text-sm">
                                              <span className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold mr-3 border border-slate-700">{i+1}</span>
                                              {step}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                              
                              <button onClick={() => setPage(PageView.CONSULT)} className="px-8 py-3 bg-white text-slate-900 font-bold rounded hover:bg-slate-200">
                                  Request Service
                              </button>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
  </div>
);

const OperatorPortal = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: (log: OperatorLog) => void }) => {
    // Stage 1: Auth, Stage 2: Log Entry
    const [authStep, setAuthStep] = useState(true);
    const [credentials, setCredentials] = useState({
        employeeId: '',
        pin: ''
    });
    
    const [formData, setFormData] = useState({
        machineId: '',
        startHours: '',
        endHours: '',
        fuel: '',
        location: '',
        notes: '',
        checklist: {
            tires: false,
            oil: false,
            hydraulics: false,
            brakes: false
        }
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if(credentials.employeeId && credentials.pin) {
            setAuthStep(false);
        } else {
            alert("Please enter valid credentials.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const start = parseFloat(formData.startHours) || 0;
        const end = parseFloat(formData.endHours) || 0;
        
        if (end < start) {
            alert("End hours cannot be less than start hours.");
            return;
        }

        const newLog: OperatorLog = {
            id: `LOG-${Date.now()}`,
            machineId: formData.machineId,
            operatorName: credentials.employeeId, // Using Employee ID as name for this demo
            date: new Date().toISOString().split('T')[0],
            startTime: '08:00', // Mocked for simplicity
            endTime: '17:00',
            startOdometer: start,
            endOdometer: end,
            fuelAddedLiters: parseFloat(formData.fuel) || 0,
            location: formData.location,
            checklist: formData.checklist,
            notes: formData.notes
        };
        onSubmit(newLog);
        onBack();
    };

    const toggleCheck = (key: keyof typeof formData.checklist) => {
        setFormData(prev => ({
            ...prev,
            checklist: { ...prev.checklist, [key]: !prev.checklist[key] }
        }));
    };

    if (authStep) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                            <UserCheck className="text-yellow-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Operator Identification</h2>
                        <p className="text-slate-400 text-sm">Please verify your credentials to access the fleet log.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Employee ID / Badge No.</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input 
                                    required 
                                    className="w-full bg-slate-950 border border-slate-700 p-3 pl-10 rounded text-white focus:border-yellow-500 outline-none transition-colors" 
                                    placeholder="e.g. OP-2024-892"
                                    value={credentials.employeeId}
                                    onChange={e => setCredentials({...credentials, employeeId: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Secure PIN</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input 
                                    required 
                                    type="password"
                                    className="w-full bg-slate-950 border border-slate-700 p-3 pl-10 rounded text-white focus:border-yellow-500 outline-none transition-colors" 
                                    placeholder="••••••"
                                    value={credentials.pin}
                                    onChange={e => setCredentials({...credentials, pin: e.target.value})}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded hover:bg-yellow-400 transition-all flex items-center justify-center">
                            Verify Identity <ArrowRight size={18} className="ml-2"/>
                        </button>
                    </form>
                    <button onClick={onBack} className="w-full text-center text-slate-500 text-sm mt-6 hover:text-slate-300">Cancel & Return</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center"><ClipboardCheck className="mr-2 text-yellow-500"/> Daily Operation Log</h2>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                            <span className="flex items-center"><User size={12} className="mr-1"/> {credentials.employeeId}</span>
                            <span className="flex items-center"><Clock size={12} className="mr-1"/> {new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                    <button onClick={onBack} className="text-slate-400 hover:text-white"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Machine Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Machine ID / Plate</label>
                            <input required className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none" 
                                placeholder="e.g. KCD 892J"
                                onChange={e => setFormData({...formData, machineId: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Site Location</label>
                            <input required className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none" 
                                placeholder="e.g. Athi River Cement Factory"
                                onChange={e => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Telemetry */}
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                        <h3 className="text-white font-bold text-sm mb-4 flex items-center"><Activity size={16} className="mr-2 text-blue-500"/> Telemetry Data</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">Start Hours/Odo</label>
                                <input required type="number" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                    onChange={e => setFormData({...formData, startHours: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">End Hours/Odo</label>
                                <input required type="number" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                    onChange={e => setFormData({...formData, endHours: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">Fuel Added (L)</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                    onChange={e => setFormData({...formData, fuel: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Safety Checklist */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4 flex items-center"><ShieldCheck size={16} className="mr-2 text-green-500"/> Pre-Start Safety Check</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { k: 'tires', l: 'Tires/Tracks', i: DiscIcon }, // Placeholder icon logic below
                                { k: 'oil', l: 'Engine Oil', i: Droplet },
                                { k: 'hydraulics', l: 'Hydraulics', i: Activity },
                                { k: 'brakes', l: 'Brakes', i: AlertTriangle }
                            ].map((item) => (
                                <button 
                                    key={item.k}
                                    type="button"
                                    onClick={() => toggleCheck(item.k as any)}
                                    className={`p-3 rounded border flex flex-col items-center justify-center transition-all ${formData.checklist[item.k as keyof typeof formData.checklist] ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-slate-950 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                                >
                                    <item.i size={20} className="mb-2" />
                                    <span className="text-xs font-bold">{item.l}</span>
                                    <div className={`w-3 h-3 rounded-full mt-2 ${formData.checklist[item.k as keyof typeof formData.checklist] ? 'bg-green-500' : 'bg-slate-800'}`}></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Operational Notes / Incidents</label>
                        <textarea className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none h-24 text-sm" 
                            placeholder="Report any faults, noises, or delays..."
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <label className="flex items-start text-slate-400 text-xs mb-6 cursor-pointer">
                            <input type="checkbox" required className="mr-3 mt-0.5" />
                            <span>
                                I certify that the above information is true and that I have conducted the required pre-start safety checks in accordance with company policy and DOSHS regulations.
                            </span>
                        </label>
                        <button type="submit" className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded hover:bg-yellow-400 shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center">
                            <FileBadge className="mr-2" size={20}/> Submit Daily Log
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Helper component for icon consistency
const DiscIcon = ({ size, className }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
);

const ERPDashboard = ({ hasAccess, onSubscribe, logs }: { hasAccess: boolean, onSubscribe: () => void, logs: OperatorLog[] }) => {
    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center filter blur-sm"></div>
                <div className="relative z-10 max-w-lg bg-slate-900/90 backdrop-blur-xl border border-yellow-500/30 p-10 rounded-2xl text-center shadow-2xl">
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
                        <button className="text-yellow-500 text-sm font-bold">View All</button>
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
                                        <td className="px-6 py-4 font-medium text-white">{log.id}</td>
                                        <td className="px-6 py-4">{log.date}</td>
                                        <td className="px-6 py-4">{log.operatorName}</td>
                                        <td className="px-6 py-4">{log.machineId}</td>
                                        <td className="px-6 py-4">{log.location}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs font-bold">Verified</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- EXISTING PAGE COMPONENTS ---

// --- HOME PAGE ---
const HomePage = ({ setPage, onBookInspection }: { setPage: (p: PageView) => void, onBookInspection: () => void }) => (
  <div className="flex flex-col">
    {/* Hero Section */}
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80" 
          alt="Construction in Kenya" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-block px-4 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6 backdrop-blur-sm">
          <span className="text-yellow-500 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
             <MapPin size={14} /> Kenya's Trusted Industrial Partner
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
          PREMIUM EQUIPMENT & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            ENGINEERING SOLUTIONS
          </span>
        </h1>
        <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
          From inspection and purchase to maintenance and fabrication, DAGIV ENGINEERING delivers comprehensive mechanical solutions for your business needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setPage(PageView.EQUIPMENT)}
            className="px-8 py-4 bg-yellow-500 text-slate-900 font-bold rounded hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
          >
            BROWSE EQUIPMENT
          </button>
          <button 
             onClick={onBookInspection}
            className="px-8 py-4 bg-slate-900/80 backdrop-blur border-2 border-white/20 text-white font-bold rounded hover:bg-white hover:text-slate-900 transition-all"
          >
            BOOK INSPECTION
          </button>
          <button 
             onClick={() => setPage(PageView.EQUIPMENT)}
            className="px-8 py-4 bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold rounded hover:bg-yellow-500 hover:text-slate-900 transition-all"
          >
            LEASE MACHINERY
          </button>
        </div>
      </div>
    </div>

    {/* ABOUT DAGIV SECTION */}
    <div className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">About DAGIV ENGINEERING</h2>
                <div className="h-1 w-20 bg-yellow-500 mx-auto mb-6"></div>
                <p className="text-slate-400 max-w-2xl mx-auto">Built on integrity, powered by expertise. We are setting new standards for mechanical engineering in East Africa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                <div className="text-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-colors">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 shadow-inner border border-slate-800">
                        <Activity size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
                    <p className="text-slate-400 text-sm">To be the undisputed leader in industrial engineering solutions across Africa, driving infrastructure growth through reliability.</p>
                </div>
                <div className="text-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-colors">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 shadow-inner border border-slate-800">
                        <BadgeCheck size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
                    <p className="text-slate-400 text-sm">Providing world-class machinery, precision fabrication, and proactive maintenance services that ensure zero downtime for our clients.</p>
                </div>
                <div className="text-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-colors">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 shadow-inner border border-slate-800">
                        <Users size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Our Goals</h3>
                    <p className="text-slate-400 text-sm">Empowering local industries, upskilling Kenyan engineers, and delivering sustainable mechanical solutions.</p>
                </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-8 md:p-12 border border-slate-800 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center"><ShieldCheck className="text-yellow-500 mr-3" /> Trust & Compliance</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start text-slate-300">
                            <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                            <span><strong>Safety First:</strong> Adherence to DOSHS workplace safety standards and OSHA guidelines for all site operations.</span>
                        </li>
                        <li className="flex items-start text-slate-300">
                            <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                            <span><strong>Certified Excellence:</strong> ISO 9001:2015 compliant processes for maintenance and fabrication.</span>
                        </li>
                        <li className="flex items-start text-slate-300">
                            <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                            <span><strong>Regulatory Compliance:</strong> All fleet equipment fully licensed with NTSA and inspected by KEBS.</span>
                        </li>
                    </ul>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded text-center border border-slate-800">
                        <FileBadge className="mx-auto text-slate-500 mb-2" size={32}/>
                        <span className="text-slate-300 font-bold text-sm block">NCA Registered</span>
                        <span className="text-xs text-slate-500">Contractor Class 4</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded text-center border border-slate-800">
                        <HardHat className="mx-auto text-slate-500 mb-2" size={32}/>
                        <span className="text-slate-300 font-bold text-sm block">EBK Certified</span>
                        <span className="text-xs text-slate-500">Professional Engineers</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded text-center border border-slate-800">
                        <ShieldCheck className="mx-auto text-slate-500 mb-2" size={32}/>
                        <span className="text-slate-300 font-bold text-sm block">Insured</span>
                        <span className="text-xs text-slate-500">Comprehensive WIBA</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded text-center border border-slate-800">
                        <Check className="mx-auto text-slate-500 mb-2" size={32}/>
                        <span className="text-slate-300 font-bold text-sm block">KEBS Standard</span>
                        <span className="text-xs text-slate-500">Quality Mark</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Core Services Preview */}
    <div className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Our Core Pillars</h2>
          <div className="h-1 w-20 bg-yellow-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900 p-8 border border-slate-800 hover:border-yellow-500/50 transition-all group cursor-pointer" onClick={() => setPage(PageView.SERVICES)}>
                <ShieldCheck className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3">Inspection & Audit</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Machine verification, compliance checks, and commissioning.</p>
            </div>
             <div className="bg-slate-900 p-8 border border-slate-800 hover:border-yellow-500/50 transition-all group cursor-pointer" onClick={() => setPage(PageView.SERVICES)}>
                <Truck className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3">Logistics & Leasing</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Heavy equipment transport and flexible fleet leasing options.</p>
            </div>
             <div className="bg-slate-900 p-8 border border-slate-800 hover:border-yellow-500/50 transition-all group cursor-pointer" onClick={() => setPage(PageView.SERVICES)}>
                <Wrench className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3">Maintenance</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Scheduled servicing, repairs, and zero-downtime strategies.</p>
            </div>
             <div className="bg-slate-900 p-8 border border-slate-800 hover:border-yellow-500/50 transition-all group cursor-pointer" onClick={() => setPage(PageView.SERVICES)}>
                <Flame className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3">Fabrication</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Custom metal works, structural repairs, and welding.</p>
            </div>
        </div>
      </div>
    </div>

    {/* ERP Teaser */}
    <div className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(#eab308 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl font-black text-white mb-6">MANAGE YOUR FLEET LIKE A CORPORATION.</h2>
                    <p className="text-lg text-slate-300 mb-8">
                        The <span className="text-yellow-500 font-bold">DAGIV Mechanical ERP</span> gives you full control. Track fuel usage, monitor driver logs, schedule maintenance, and predict costs—all from one premium dashboard.
                    </p>
                    <ul className="space-y-4 mb-8">
                        {['Real-time GPS Tracking', 'Automated Maintenance Alerts', 'Cost & Fuel Analytics', 'Driver Performance Logs'].map((item, i) => (
                            <li key={i} className="flex items-center text-slate-400">
                                <CheckCircle className="text-yellow-500 w-5 h-5 mr-3" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => setPage(PageView.ERP)}
                        className="px-8 py-4 bg-white text-slate-900 font-bold rounded shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(234,179,8,1)] transition-all"
                    >
                        REQUEST ERP ACCESS
                    </button>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-yellow-500/20 blur-xl rounded-full"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="ERP Dashboard Preview" 
                        className="rounded-lg shadow-2xl border border-slate-700 relative z-10"
                    />
                     {/* Floating UI Elements for effect */}
                     <div className="absolute -bottom-6 -left-6 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl z-20">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Fuel Efficiency</div>
                        <div className="text-2xl font-bold text-green-500">+12.4%</div>
                     </div>
                </div>
            </div>
        </div>
    </div>
  </div>
);

// --- EQUIPMENT PAGE ---
const EquipmentPage = ({ setPage, onBookInspection }: { setPage: (p: PageView) => void, onBookInspection: () => void }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSubCategory, setFilterSubCategory] = useState('All');
  const [filterType, setFilterType] = useState('All'); // Sale, Lease
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  
  const categories = ['All', 'Heavy Plant Equipment', 'Light Plant Equipment', 'Automotive & Heavy Machinery', 'Light Automobiles'];

  // Reset subcategory when main category changes
  useEffect(() => {
    setFilterSubCategory('All');
  }, [filterCategory]);

  const filteredData = EQUIPMENT_DATA.filter(item => {
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSubCategory = filterSubCategory === 'All' || item.subCategory === filterSubCategory;
    const matchesType = filterType === 'All' || 
                        (filterType === 'Sale' && (item.listingType === 'Sale' || item.listingType === 'Both')) ||
                        (filterType === 'Lease' && (item.listingType === 'Lease' || item.listingType === 'Both'));
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.brand.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch && matchesType;
  });

  // Calculate available subcategories based on current Category selection
  const availableSubCategories = ['All', ...Array.from(new Set(EQUIPMENT_DATA
    .filter(item => filterCategory === 'All' || item.category === filterCategory)
    .map(item => item.subCategory)))];

  const EquipmentModal = () => {
      if(!selectedItem) return null;
      return (
          <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
              <div className="bg-slate-900 w-full max-w-5xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
                  <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors"><X size={24}/></button>
                  
                  {/* Left: Image */}
                  <div className="w-full md:w-1/2 bg-slate-950 relative">
                      <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-4 left-4 flex gap-2">
                          {/* Simulated Gallery Thumbs */}
                          <div className="w-16 h-16 rounded border-2 border-yellow-500 overflow-hidden cursor-pointer"><img src={selectedItem.image} className="w-full h-full object-cover"/></div>
                          <div className="w-16 h-16 rounded border border-slate-500 bg-slate-800 flex items-center justify-center text-slate-500 text-xs cursor-pointer">Rear</div>
                          <div className="w-16 h-16 rounded border border-slate-500 bg-slate-800 flex items-center justify-center text-slate-500 text-xs cursor-pointer">Cab</div>
                      </div>
                  </div>

                  {/* Right: Details */}
                  <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[90vh]">
                      <div className="mb-6">
                          <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest">{selectedItem.brand} • {selectedItem.year}</span>
                          <h2 className="text-3xl font-bold text-white mb-2">{selectedItem.name}</h2>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                              <span className="flex items-center"><MapPin size={14} className="mr-1"/> {selectedItem.location}</span>
                              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                              <span>{selectedItem.hoursUsed ? `${selectedItem.hoursUsed} Hours` : 'New'}</span>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                          {Object.entries(selectedItem.specs).map(([k, v]) => (
                              <div key={k} className="bg-slate-800 p-3 rounded">
                                  <div className="text-xs text-slate-500 uppercase">{k}</div>
                                  <div className="text-white font-bold text-sm">{v}</div>
                              </div>
                          ))}
                      </div>

                      <div className="mb-6">
                          <h4 className="text-white font-bold mb-2">Condition Report</h4>
                          <p className="text-slate-400 text-sm leading-relaxed">{selectedItem.description}</p>
                      </div>

                      <div className="border-t border-slate-800 pt-6 space-y-4">
                          {selectedItem.priceSale && (
                              <div className="flex justify-between items-center">
                                  <span className="text-slate-400">Buy Price</span>
                                  <span className="text-2xl font-bold text-white">KES {selectedItem.priceSale.toLocaleString()}</span>
                              </div>
                          )}
                          {selectedItem.priceLease && (
                              <div className="flex justify-between items-center">
                                  <span className="text-slate-400">Lease Rate</span>
                                  <span className="text-xl font-bold text-yellow-500">{selectedItem.priceLease}</span>
                              </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                              {(selectedItem.listingType === 'Sale' || selectedItem.listingType === 'Both') && 
                                <button onClick={() => alert(`Purchase Inquiry for ${selectedItem.name} initiated. A sales rep will call you.`)} className="bg-green-600 text-white font-bold py-3 rounded hover:bg-green-500">Buy Now</button>
                              }
                              {(selectedItem.listingType === 'Lease' || selectedItem.listingType === 'Both') && 
                                <button onClick={() => alert(`Lease Application for ${selectedItem.name} started.`)} className="bg-slate-700 text-white font-bold py-3 rounded hover:bg-slate-600">Lease</button>
                              }
                          </div>
                          <button onClick={() => { setSelectedItem(null); onBookInspection(); }} className="w-full border-2 border-yellow-500 text-yellow-500 font-bold py-3 rounded hover:bg-yellow-500 hover:text-slate-900 transition-colors flex items-center justify-center">
                              <Search size={18} className="mr-2"/> Request Physical Inspection
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-800 pb-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Equipment Catalog</h2>
            <p className="text-slate-400">Kenya's premier heavy machinery inventory.</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden flex items-center px-4 py-2 bg-slate-900 border border-slate-700 rounded text-slate-300">
                <Filter size={18} className="mr-2"/> Filters
             </button>
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search (e.g. Excavator)..." 
                  className="bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded focus:outline-none focus:border-yellow-500 w-full"
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`w-full md:w-64 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
                <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 sticky top-24">
                    <h3 className="text-white font-bold mb-4 flex items-center"><Filter size={16} className="mr-2 text-yellow-500"/> Filter Inventory</h3>
                    
                    <div className="mb-6">
                        <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Acquisition Type</label>
                        <div className="flex flex-col gap-2">
                            {['All', 'Sale', 'Lease'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`text-left px-3 py-2 rounded text-sm ${filterType === type ? 'bg-yellow-500 text-slate-900 font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
                                >
                                    {type === 'All' ? 'All Listings' : `For ${type}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Categories</label>
                        <div className="flex flex-col gap-2">
                             {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`text-left px-3 py-2 rounded text-sm ${filterCategory === cat ? 'bg-slate-800 text-white font-medium border-l-2 border-yellow-500' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sub-Category Filter */}
                    {availableSubCategories.length > 2 && (
                      <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                          <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Sub-Categories</label>
                          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                              {availableSubCategories.map(sub => (
                                  <button 
                                      key={sub}
                                      onClick={() => setFilterSubCategory(sub)}
                                      className={`text-left px-3 py-1.5 rounded text-xs ${filterSubCategory === sub ? 'bg-yellow-500/20 text-yellow-500 font-bold border border-yellow-500/30' : 'text-slate-400 hover:text-white'}`}
                                  >
                                      {sub}
                                  </button>
                              ))}
                          </div>
                      </div>
                    )}
                </div>
            </div>

            {/* Grid Results */}
            <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.map(item => (
                    <div key={item.id} className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 hover:border-yellow-500/50 transition-all group flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                             {item.listingType !== 'Sale' && <span className="bg-yellow-500 text-slate-900 px-2 py-1 rounded text-xs font-bold uppercase shadow-sm">Lease</span>}
                             {item.listingType !== 'Lease' && <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold uppercase shadow-sm">For Sale</span>}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4">
                            <span className="text-white text-xs font-bold bg-slate-800/80 px-2 py-1 rounded backdrop-blur-sm">{item.year} • {item.hoursUsed ? item.hoursUsed + ' hrs' : 'New'}</span>
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="text-xs text-yellow-500 font-bold uppercase mb-1">{item.brand} • {item.subCategory}</div>
                        <h3 className="text-lg font-bold text-white mb-3 leading-tight">{item.name}</h3>
                        <div className="space-y-2 mb-4 flex-1">
                            {Object.entries(item.specs).slice(0, 3).map(([key, val]) => (
                                <div key={key} className="flex justify-between text-sm border-b border-slate-800/50 pb-1">
                                    <span className="text-slate-500">{key}</span>
                                    <span className="text-slate-300 font-medium">{val}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-800">
                             {item.priceSale && (
                                 <div className="flex justify-between items-center mb-1">
                                     <span className="text-xs text-slate-500 uppercase">Buy Price</span>
                                     <span className="text-white font-bold">KES {item.priceSale.toLocaleString()}</span>
                                 </div>
                             )}
                             {item.priceLease && (
                                 <div className="flex justify-between items-center">
                                     <span className="text-xs text-slate-500 uppercase">Lease Rate</span>
                                     <span className="text-yellow-500 font-bold">{item.priceLease}</span>
                                 </div>
                             )}
                            <button onClick={() => setSelectedItem(item)} className="w-full mt-4 py-2 border border-slate-700 rounded text-sm font-bold text-slate-300 hover:bg-yellow-500 hover:border-yellow-500 hover:text-slate-900 transition-colors">
                                View Details &rarr;
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
      </div>
      <EquipmentModal />
    </div>
  );
};

// --- SPARE PARTS MARKETPLACE PAGE ---
const SparePartsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<{part: SparePart, qty: number}[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(0); 

    const categories = ['All', 'Hydraulics', 'Engine Parts', 'Undercarriage', 'Filters', 'Electrical', 'Ground Engaging Tools'];
    const filteredParts = SPARE_PARTS.filter(p => {
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                              p.partNumber.toLowerCase().includes(search.toLowerCase()) || 
                              p.equipmentType.join(' ').toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const addToCart = (part: SparePart, qty: number = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.part.id === part.id);
            if(existing) return prev.map(i => i.part.id === part.id ? {...i, qty: i.qty + qty} : i);
            return [...prev, {part, qty}];
        });
        setCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(i => i.part.id !== id));
    };

    // Reusing the CartDrawer from previous implementation logic but integrated here
    const CartDrawer = () => (
        <div className={`fixed inset-y-0 right-0 z-[70] w-full md:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
             <div className="h-full flex flex-col">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <h2 className="text-lg font-bold text-white flex items-center"><ShoppingCart className="mr-2" size={18}/> RFQ / Cart ({cart.length})</h2>
                    <button onClick={() => setCartOpen(false)}><X className="text-slate-400 hover:text-white"/></button>
                </div>
                
                {checkoutStep === 0 && (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? <p className="text-slate-500 text-center mt-10 text-sm">Cart is empty.</p> : 
                                cart.map(item => (
                                    <div key={item.part.id} className="flex gap-3 bg-slate-950 p-2 rounded border border-slate-800">
                                        <img src={item.part.image} className="w-12 h-12 object-cover rounded border border-slate-800" />
                                        <div className="flex-1">
                                            <h4 className="text-white text-xs font-bold line-clamp-1">{item.part.name}</h4>
                                            <p className="text-slate-500 text-[10px] font-mono">{item.part.partNumber}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-yellow-500 text-xs font-bold">KES {item.part.price.toLocaleString()}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400">Qty: {item.qty}</span>
                                                    <button onClick={() => removeFromCart(item.part.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={12}/></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="p-4 border-t border-slate-800 bg-slate-950">
                            <div className="flex justify-between text-white font-bold mb-4 text-sm">
                                <span>Est. Total:</span>
                                <span>KES {cart.reduce((a, c) => a + (c.part.price * c.qty), 0).toLocaleString()}</span>
                            </div>
                            <button onClick={() => setCheckoutStep(1)} disabled={cart.length === 0} className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded text-sm disabled:opacity-50 hover:bg-yellow-400">PROCEED TO CHECKOUT</button>
                        </div>
                    </>
                )}
                 {checkoutStep === 1 && (
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-white font-bold mb-4 text-sm">Shipping Information</h3>
                        <form className="space-y-3 flex-1" onSubmit={(e) => { e.preventDefault(); setCheckoutStep(2); }}>
                            <input className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white text-sm" placeholder="Company / Name" required />
                            <input className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white text-sm" placeholder="Phone Contact" required />
                            <input className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white text-sm" placeholder="Shipping Address" required />
                            <div className="flex-1"></div>
                            <button type="button" onClick={() => setCheckoutStep(0)} className="w-full border border-slate-700 text-white py-2 rounded mb-2 text-sm">Back</button>
                            <button type="submit" className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded text-sm hover:bg-yellow-400">Next: Payment</button>
                        </form>
                    </div>
                )}
                {checkoutStep === 2 && (
                    <div className="p-4 flex-1 flex flex-col text-center">
                        <h3 className="text-white font-bold mb-6 text-sm">Select Payment Method</h3>
                        <div className="space-y-4 mb-8">
                            <button onClick={() => setCheckoutStep(3)} className="w-full bg-green-600 p-3 rounded text-white font-bold flex items-center justify-center hover:bg-green-500 text-sm">
                                M-PESA Express
                            </button>
                            <button onClick={() => setCheckoutStep(3)} className="w-full bg-slate-800 p-3 rounded text-white font-bold flex items-center justify-center hover:bg-slate-700 text-sm">
                                <CreditCard className="mr-2" size={16}/> Credit Card / EFT
                            </button>
                        </div>
                        <button onClick={() => setCheckoutStep(1)} className="mt-auto text-slate-500 text-sm">Back</button>
                    </div>
                )}
                {checkoutStep === 3 && (
                    <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4">
                            <Check size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Order Confirmed!</h3>
                        <p className="text-slate-400 text-sm mb-6">Order #DAG-{Math.floor(Math.random()*10000)}. <br/> Invoice sent to your email.</p>
                        <button onClick={() => { setCart([]); setCheckoutStep(0); setCartOpen(false); }} className="bg-slate-800 text-white px-6 py-2 rounded text-sm hover:bg-slate-700">Close</button>
                    </div>
                )}
             </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
            {/* Top Search & Action Bar */}
            <div className="bg-slate-900 border-b border-slate-800 sticky top-20 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-96">
                            <input 
                                type="text" 
                                placeholder="Search Part Number, Keyword, or Manufacturer..." 
                                className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:border-yellow-500 text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                        </div>
                        <button className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-4 py-2 rounded font-bold text-sm flex items-center gap-2 whitespace-nowrap">
                            <Search size={16}/> Search
                        </button>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                         <button className="text-slate-300 hover:text-white text-xs font-bold flex items-center border border-slate-700 px-3 py-2 rounded bg-slate-950">
                            <FileSpreadsheet size={14} className="mr-2 text-green-500"/> Upload BOM
                         </button>
                         <button onClick={() => setCartOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm relative border border-slate-700">
                            <ShoppingCart size={16} />
                            <span className="font-bold">{cart.length} Item(s)</span>
                         </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
                {/* Left Sidebar - Categories */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden sticky top-40">
                        <div className="bg-slate-950 p-3 border-b border-slate-800 font-bold text-white text-sm flex items-center">
                            <List size={14} className="mr-2"/> Product Categories
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full text-left px-4 py-2.5 text-xs font-medium border-b border-slate-800/50 hover:bg-slate-800 transition-colors ${selectedCategory === cat ? 'bg-yellow-500/10 text-yellow-500 border-l-2 border-l-yellow-500' : 'text-slate-400 border-l-2 border-l-transparent'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-950 border-t border-slate-800">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">Filters</div>
                            <label className="flex items-center text-xs text-slate-300 mb-2 cursor-pointer">
                                <input type="checkbox" className="mr-2 bg-slate-800 border-slate-600 rounded" defaultChecked />
                                In Stock Only
                            </label>
                            <label className="flex items-center text-xs text-slate-300 mb-2 cursor-pointer">
                                <input type="checkbox" className="mr-2 bg-slate-800 border-slate-600 rounded" />
                                RoHS Compliant
                            </label>
                             <label className="flex items-center text-xs text-slate-300 cursor-pointer">
                                <input type="checkbox" className="mr-2 bg-slate-800 border-slate-600 rounded" defaultChecked />
                                Verified Supplier
                            </label>
                        </div>
                    </div>
                </div>

                {/* Main Content - Product Grid */}
                <div className="flex-1">
                    <div className="mb-4 flex items-center justify-between">
                         <h3 className="text-white font-bold flex items-center">
                            {selectedCategory} <span className="text-slate-500 text-sm font-normal ml-2">({filteredParts.length} products)</span>
                         </h3>
                         <div className="flex items-center gap-2 text-sm text-slate-400">
                             <span>Sort By:</span>
                             <select className="bg-slate-900 border border-slate-700 rounded text-white text-xs p-1 focus:outline-none">
                                 <option>Relevance</option>
                                 <option>Price: Low to High</option>
                                 <option>Price: High to Low</option>
                                 <option>Newest Arrival</option>
                             </select>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        {filteredParts.map(part => (
                            <div key={part.id} className="bg-slate-900 border border-slate-800 rounded-lg hover:border-yellow-500/50 transition-all flex flex-col group relative overflow-hidden">
                                {/* Supplier Badge */}
                                {part.supplier.verified && (
                                    <div className="absolute top-0 right-0 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl shadow-sm z-10 flex items-center">
                                        <BadgeCheck size={10} className="mr-1"/> Verified
                                    </div>
                                )}
                                
                                <div className="p-3 flex gap-4 border-b border-slate-800/50">
                                    <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 border border-slate-700 p-1">
                                        <img src={part.image} className="w-full h-full object-contain" alt={part.name} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider mb-0.5">{part.supplier.name}</div>
                                        <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2 hover:text-yellow-500 cursor-pointer" title={part.name}>{part.name}</h4>
                                        <div className="font-mono text-xs text-slate-400 bg-slate-950 inline-block px-1 rounded border border-slate-800 mb-1">{part.partNumber}</div>
                                    </div>
                                </div>

                                <div className="p-3 flex-1 flex flex-col text-xs">
                                     <div className="grid grid-cols-2 gap-y-1 gap-x-2 mb-3 text-slate-400">
                                        {Object.entries(part.specs).slice(0,4).map(([k,v]) => (
                                            <div key={k} className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 uppercase">{k}</span>
                                                <span className="text-slate-300 font-medium truncate" title={v}>{v}</span>
                                            </div>
                                        ))}
                                     </div>

                                     <div className="mt-auto flex items-end justify-between">
                                         <div>
                                            <div className="text-[10px] text-slate-500 mb-0.5">Unit Price</div>
                                            <div className="text-lg font-bold text-yellow-500">KES {part.price.toLocaleString()}</div>
                                            <div className="flex items-center text-[10px] text-green-500 font-bold mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                                                {part.stock} In Stock
                                            </div>
                                         </div>
                                         <div className="flex flex-col items-end gap-2">
                                             <a href="#" className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center hover:underline">
                                                 <FileText size={10} className="mr-1"/> Datasheet
                                             </a>
                                             <button 
                                                onClick={() => addToCart(part)}
                                                className="bg-slate-800 hover:bg-yellow-500 hover:text-slate-900 text-white border border-slate-700 font-bold py-1.5 px-3 rounded flex items-center transition-colors shadow-sm"
                                             >
                                                <ShoppingCart size={14} className="mr-1.5"/> Add
                                             </button>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <CartDrawer />
        </div>
    );
};

// --- PROFESSIONALS PAGE ---
const ProfessionalsPage = () => {
    const [filterRole, setFilterRole] = useState('All');
    
    const roles = ['All', 'Engineer', 'Welder', 'Fabricator', 'Mechanic', 'Operator', 'Drivers'];
    
    const filteredPros = filterRole === 'All' ? PROFESSIONALS : PROFESSIONALS.filter(p => p.role + 's' === filterRole || p.role === filterRole);

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4">
            <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <h2 className="text-4xl font-bold text-white">Professionals Hub</h2>
                <div className="flex gap-2 flex-wrap mt-4 md:mt-0">
                    {roles.map(r => (
                        <button 
                            key={r} 
                            onClick={() => setFilterRole(r)}
                            className={`px-4 py-2 rounded-full text-sm font-bold ${filterRole === r ? 'bg-yellow-500 text-slate-900' : 'bg-slate-900 text-slate-300 border border-slate-700'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPros.map(prof => (
                <div key={prof.id} className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-center hover:border-yellow-500/50 transition-colors group">
                    <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl overflow-hidden relative border-2 border-slate-700 group-hover:border-yellow-500 transition-colors">
                        <span className="text-slate-500 font-bold">{prof.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg">{prof.name}</h3>
                    <p className="text-yellow-500 text-sm font-bold uppercase mb-2">{prof.role}</p>
                    <div className="flex justify-center gap-1 mb-4 text-yellow-500">
                    {[...Array(5)].map((_,i) => <Star key={i} size={14} fill={i < Math.floor(prof.rating) ? "currentColor" : "none"} />)}
                    </div>
                    <p className="text-slate-400 text-sm mb-4 flex justify-center items-center"><MapPin size={12} className="inline mr-1"/>{prof.location}</p>
                    <button className="w-full border border-slate-700 text-slate-300 py-2 rounded text-sm hover:bg-white hover:text-slate-900 font-bold">View Profile</button>
                </div>
                ))}
            </div>
            </div>
        </div>
    );
};

// --- CONSULT PAGE (AI & HUMAN) ---
const ConsultPage = () => {
  const [activeTab, setActiveTab] = useState<'AI' | 'HUMAN'>('HUMAN'); // Default to human form
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS'>('IDLE');

  // AI State
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!prompt.trim()) return;
    setLoading(true);
    const answer = await generateEngineeringAdvice(prompt);
    setResponse(answer);
    setLoading(false);
  };

  const handleHumanSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus('SUBMITTING');
      setTimeout(() => setFormStatus('SUCCESS'), 1500);
  };

  return (
     <div className="min-h-screen bg-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">Engineering Consultation</h2>
                <p className="text-slate-400">Get expert advice instantly from our AI or schedule a session with a certified professional.</p>
                <div className="flex justify-center gap-4 mt-8">
                    <button 
                        onClick={() => setActiveTab('HUMAN')}
                        className={`px-6 py-3 rounded-lg font-bold flex items-center ${activeTab === 'HUMAN' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-900 border border-slate-700 text-slate-300'}`}
                    >
                        <User className="mr-2"/> Professional Engineer
                    </button>
                    <button 
                        onClick={() => setActiveTab('AI')}
                        className={`px-6 py-3 rounded-lg font-bold flex items-center ${activeTab === 'AI' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-900 border border-slate-700 text-slate-300'}`}
                    >
                        <Activity className="mr-2"/> AI Consultant
                    </button>
                </div>
            </div>

            {activeTab === 'AI' ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl animate-in fade-in">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500"><Activity/></div>
                        <div>
                            <h3 className="text-white font-bold">DAGIV AI Engineer</h3>
                            <p className="text-slate-500 text-xs">Online • Instant Response</p>
                        </div>
                    </div>
                    <form onSubmit={handleAiAsk} className="mb-8">
                        <div className="relative">
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., What are the standard maintenance intervals for a Komatsu D155A dozer?"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:border-yellow-500 outline-none h-32 resize-none"
                            />
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="absolute bottom-4 right-4 bg-yellow-500 text-slate-900 px-6 py-2 rounded-md font-bold hover:bg-yellow-400 disabled:opacity-50"
                            >
                                {loading ? 'Analyzing...' : 'Ask Engineer'}
                            </button>
                        </div>
                    </form>
                    {response && (
                        <div className="bg-slate-950 border-l-4 border-yellow-500 p-6 rounded-r-lg shadow-xl">
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{response}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl animate-in fade-in">
                    {formStatus === 'SUCCESS' ? (
                        <div className="text-center py-10">
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                            <p className="text-slate-400">Your consultation request has been logged. Ticket #CN-921.<br/>An engineer will contact you shortly via WhatsApp.</p>
                            <button onClick={() => setFormStatus('IDLE')} className="mt-6 text-yellow-500 underline">Submit another request</button>
                        </div>
                    ) : (
                        <form onSubmit={handleHumanSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Your Name</label>
                                    <input type="text" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Phone (WhatsApp)</label>
                                    <input type="text" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none" placeholder="+254..." required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Consultation Type</label>
                                <select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none">
                                    <option>General Technical Advice (Free)</option>
                                    <option>Site Inspection Request (Paid)</option>
                                    <option>Machine Valuation (Paid)</option>
                                    <option>Project Feasibility Study (Paid)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Project / Machine Details</label>
                                <textarea className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none h-32" required placeholder="Describe your issue or requirement..."></textarea>
                            </div>
                            <div className="flex items-center gap-4">
                                <button type="submit" disabled={formStatus === 'SUBMITTING'} className="flex-1 bg-yellow-500 text-slate-900 font-bold py-4 rounded hover:bg-yellow-400 transition-colors">
                                    {formStatus === 'SUBMITTING' ? 'Scheduling...' : 'SCHEDULE CONSULTATION'}
                                </button>
                                <button type="button" className="px-6 py-4 bg-green-600 text-white font-bold rounded hover:bg-green-500 flex items-center">
                                    <Phone className="mr-2" size={20} /> Call Now
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
     </div>
  );
};

// --- INSPECTION BOOKING PAGE ---
const InspectionBookingPage = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(1);
    
    return (
        <div className="min-h-screen bg-slate-950 py-16 px-4">
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-yellow-500 p-6">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center"><Search className="mr-3"/> BOOK INSPECTION</h2>
                    <p className="text-slate-900/80 font-medium">Schedule a certified engineer to inspect your machinery.</p>
                </div>
                
                {step === 1 && (
                    <div className="p-8 space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Step 1: Machine Details</h3>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Machine Type</label>
                            <select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-4">
                                <option>Excavator</option>
                                <option>Truck</option>
                                <option>Generator</option>
                                <option>Other</option>
                            </select>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Location of Machine</label>
                            <input type="text" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. Athi River Site" />
                        </div>
                        <button onClick={() => setStep(2)} className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded">Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-8 space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Step 2: Contact Info</h3>
                        <input type="text" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Contact Person" />
                        <input type="text" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Phone Number" />
                        <input type="date" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" />
                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 bg-slate-800 text-white font-bold py-3 rounded">Back</button>
                            <button onClick={() => setStep(3)} className="flex-1 bg-yellow-500 text-slate-900 font-bold py-3 rounded">Book Now</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6 text-white"><Check size={40}/></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Inspection Booked!</h3>
                        <p className="text-slate-400 mb-6">Order #INSP-{Math.floor(Math.random()*1000)}. Status: <span className="text-yellow-500 font-bold">PENDING</span>.<br/>Our team will confirm availability within 2 hours.</p>
                        <button onClick={onComplete} className="bg-slate-800 text-white px-8 py-3 rounded font-bold">Return Home</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CONTACT PAGE ---
const ContactPage = () => (
    <div className="min-h-screen bg-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl overflow-hidden flex flex-col md:flex-row border border-slate-800">
            <div className="p-10 md:w-1/2 bg-yellow-500 text-slate-900">
                <h2 className="text-3xl font-black mb-6">Get in Touch</h2>
                <p className="font-medium mb-8">Visit our HQ or send us a message regarding equipment sales or leasing.</p>
                <div className="space-y-4">
                    <div className="flex items-center"><MapPin className="mr-3"/> Industrial Area, Nairobi</div>
                    <a href="tel:+254700000000" className="flex items-center hover:underline"><Phone className="mr-3"/> +254 700 000 000</a>
                    <a href="mailto:info@dagiv.co.ke" className="flex items-center hover:underline"><User className="mr-3"/> info@dagiv.co.ke</a>
                </div>
            </div>
            <div className="p-10 md:w-1/2">
                <form className="space-y-4">
                    <input type="text" placeholder="Name" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" />
                    <input type="email" placeholder="Email" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" />
                    <textarea placeholder="Message" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white h-32"></textarea>
                    <button className="w-full bg-white text-slate-900 font-bold py-3 rounded hover:bg-slate-200">Send Message</button>
                </form>
            </div>
        </div>
    </div>
);

// --- MAIN APP COMPONENT ---
const App = () => {
  const [page, setPage] = useState<PageView>(PageView.HOME);
  const [erpAccess, setErpAccess] = useState(false);
  const [operatorLogs, setOperatorLogs] = useState<OperatorLog[]>(INITIAL_LOGS);
  const [showOperatorPortal, setShowOperatorPortal] = useState(false);
  const [inspectionMode, setInspectionMode] = useState(false);

  // Helper to handle log submission from portal
  const handleLogSubmit = (newLog: OperatorLog) => {
    setOperatorLogs([newLog, ...operatorLogs]);
  };

  if (showOperatorPortal) {
    return (
      <OperatorPortal 
        onBack={() => setShowOperatorPortal(false)} 
        onSubmit={handleLogSubmit} 
      />
    );
  }

  if (inspectionMode) {
      return <InspectionBookingPage onComplete={() => { setInspectionMode(false); setPage(PageView.HOME); }} />
  }

  const renderContent = () => {
    switch (page) {
      case PageView.HOME:
        return <HomePage setPage={setPage} onBookInspection={() => setInspectionMode(true)} />;
      case PageView.EQUIPMENT:
        return <EquipmentPage setPage={setPage} onBookInspection={() => setInspectionMode(true)} />;
      case PageView.SPARE_PARTS:
        return <SparePartsPage />;
      case PageView.SERVICES:
        return <ServicesPage setPage={setPage} />;
      case PageView.ERP:
        return <ERPDashboard hasAccess={erpAccess} onSubscribe={() => setErpAccess(true)} logs={operatorLogs} />;
      case PageView.PROFESSIONALS:
        return <ProfessionalsPage />;
      case PageView.CONSULT:
        return <ConsultPage />;
      case PageView.CONTACT:
        return <ContactPage />;
      default:
        return <HomePage setPage={setPage} onBookInspection={() => setInspectionMode(true)} />;
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col font-sans text-slate-200 selection:bg-yellow-500 selection:text-slate-900">
      <Navbar 
        currentPage={page} 
        setPage={setPage} 
        onLoginClick={() => setShowOperatorPortal(true)} 
      />
      <div className="flex-1">
        {renderContent()}
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

export default App;
