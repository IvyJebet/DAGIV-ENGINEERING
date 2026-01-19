import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from './components/Layout';
import { PageView, UserRole, OperatorLog, EquipmentItem, SparePart, MaintenanceTask, Alert, ProfessionalProfile, ServiceDetail } from './types';
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

// --- COMPONENTS ---

// Service Request Modal Component
const ServiceRequestModal = ({ service, onClose }: { service: ServiceDetail, onClose: () => void }) => {
    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        details: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('SENDING');
        
        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                serviceType: service.title,
                details: formData.details,
                company: formData.company || "N/A"
            };

            const res = await fetch('http://localhost:8000/api/service-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if(res.ok) setStatus('SUCCESS');
            else {
                alert("Server Error: Could not submit request.");
                setStatus('IDLE');
            }

        } catch (error) {
            console.error(error);
            alert("Failed to connect to server");
            setStatus('IDLE');
        }
    };

    if (status === 'SUCCESS') {
        return (
            <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Request Received</h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        We have successfully logged your inquiry regarding <span className="text-yellow-500 font-bold">{service.title}</span>. 
                        <br/><br/>
                        Our engineering team has been notified and will contact you via email shortly.
                    </p>
                    <button onClick={onClose} className="bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors w-full border border-slate-700 hover:border-slate-600">
                        Close & Return to Services
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-start">
                    <div>
                        <div className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> Service Request
                        </div>
                        <h3 className="text-2xl font-black text-white leading-tight">{service.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full"><X size={20}/></button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-slate-500 text-xs font-bold uppercase">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3.5 text-slate-600 group-focus-within:text-yellow-500 transition-colors" size={16}/>
                                    <input 
                                        required 
                                        className="w-full bg-slate-950 border border-slate-700 p-3 pl-10 rounded-lg text-white focus:border-yellow-500 outline-none transition-colors placeholder:text-slate-700 font-medium" 
                                        placeholder="John Doe" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <label className="block text-slate-500 text-xs font-bold uppercase">Company (Optional)</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-3 top-3.5 text-slate-600 group-focus-within:text-yellow-500 transition-colors" size={16}/>
                                    <input 
                                        className="w-full bg-slate-950 border border-slate-700 p-3 pl-10 rounded-lg text-white focus:border-yellow-500 outline-none transition-colors placeholder:text-slate-700 font-medium" 
                                        placeholder="Acme Construction Ltd" 
                                        value={formData.company}
                                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-slate-500 text-xs font-bold uppercase">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-yellow-500 outline-none transition-colors placeholder:text-slate-700 font-medium" 
                                placeholder="john@example.com" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                         <div className="space-y-2">
                            <label className="block text-slate-500 text-xs font-bold uppercase">Phone Number</label>
                            <input 
                                type="tel" 
                                required 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-yellow-500 outline-none transition-colors placeholder:text-slate-700 font-medium" 
                                placeholder="+254 700 000 000" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-slate-500 text-xs font-bold uppercase">Project Details / Requirements</label>
                            <textarea 
                                required 
                                className="w-full bg-slate-950 border border-slate-700 p-4 rounded-lg text-white focus:border-yellow-500 outline-none transition-colors h-32 resize-none placeholder:text-slate-700 font-medium text-sm leading-relaxed" 
                                placeholder="Please describe your site location, equipment needs, or specific maintenance issues..."
                                value={formData.details}
                                onChange={(e) => setFormData({...formData, details: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={status === 'SENDING'} className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded-lg hover:bg-yellow-400 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] disabled:opacity-70 disabled:shadow-none">
                                {status === 'SENDING' ? (
                                    <span className="flex items-center"><RefreshCw className="animate-spin mr-3" /> Processing Request...</span>
                                ) : (
                                    <span className="flex items-center">Submit Service Request <ArrowRight size={18} className="ml-2"/></span>
                                )}
                            </button>
                            <p className="text-center text-slate-600 text-xs mt-6">
                                By submitting this form, you request a formal quotation from DAGIV ENGINEERING. <br/>We respect your privacy and will not share your data.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- SERVICES PAGE ---
const ServicesPage = ({ setPage }: { setPage: (p: PageView) => void }) => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  // SENIOR DEV PATTERN: Smart Ordering Engine
  // -----------------------------------------------------------
  // Current Logic: Force 'High LTV' services (Maintenance) to top.
  // Future Logic: Replace this function with a 'usePersonalizedSort' hook 
  // that queries the backend for the user's most frequented categories.
  const getOrderedServices = () => {
      const PRIORITY_SERVICE_ID = 'srv3'; // ID for Maintenance & Repairs from constants.ts
      
      const primaryService = SERVICES_CONTENT.find(s => s.id === PRIORITY_SERVICE_ID);
      const otherServices = SERVICES_CONTENT.filter(s => s.id !== PRIORITY_SERVICE_ID);
      
      // Safety check: If ID changes or doesn't exist, fallback gracefully
      if (!primaryService) return SERVICES_CONTENT;
      
      return [primaryService, ...otherServices];
  };

  const orderedServices = getOrderedServices();
  // -----------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Our Engineering Services</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">From procurement to maintenance, we handle the entire lifecycle of your heavy machinery.</p>
            </div>
            <div className="space-y-20">
                {orderedServices.map((service, idx) => {
                    const Icon = service.icon;
                    return (
                        <div key={service.id} className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                            <div className="flex-1">
                                <img src={service.image} alt={service.title} className="rounded-xl shadow-2xl border border-slate-800" />
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-yellow-500 border border-slate-700 shadow-inner">
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-white">{service.title}</h3>
                                <p className="text-slate-300 text-lg leading-relaxed">{service.fullDesc}</p>
                                
                                <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                                    <h4 className="text-yellow-500 font-bold uppercase text-xs mb-4 tracking-wider">Our Process</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {service.process.map((step, i) => (
                                            <div key={i} className="flex items-center text-slate-400 text-sm">
                                                <span className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold mr-3 border border-slate-700 text-slate-500">{i+1}</span>
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setSelectedService(service)} 
                                    className="px-8 py-3 bg-white text-slate-900 font-bold rounded hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_4px_0_0_rgba(15,23,42,1)]"
                                >
                                    Request Service
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {selectedService && (
            <ServiceRequestModal 
                service={selectedService} 
                onClose={() => setSelectedService(null)} 
            />
        )}
    </div>
  );
};

// --- HOME PAGE (REFACTORED) ---
const HomePage = ({ setPage, onBookInspection }: { setPage: (p: PageView) => void, onBookInspection: () => void }) => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  return (
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
        
        {/* NEW: QUICK ACTION GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <button 
                onClick={() => setPage(PageView.EQUIPMENT)}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <ShoppingCart size={24} />
                </div>
                <span className="text-white font-bold text-sm">Buy / Sell Machinery</span>
            </button>

            <button 
                onClick={onBookInspection}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <Search size={24} />
                </div>
                <span className="text-white font-bold text-sm">Book Inspection</span>
            </button>

            <button 
                onClick={() => setPage(PageView.EQUIPMENT)}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <Truck size={24} />
                </div>
                <span className="text-white font-bold text-sm">Lease Fleet</span>
            </button>

            <button 
                onClick={() => setPage(PageView.SERVICES)}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <Wrench size={24} />
                </div>
                <span className="text-white font-bold text-sm">Get Maintenance</span>
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

            <div className="bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-800 flex flex-col md:flex-row gap-12 items-center">
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

    {/* Core Services Preview (REFACTORED WITH REQUEST BUTTONS) */}
    <div className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Our Core Pillars</h2>
          <div className="h-1 w-20 bg-yellow-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES_CONTENT.map((service) => {
                const Icon = service.icon;
                return (
                    <div key={service.id} className="bg-slate-900 p-8 border border-slate-800 hover:border-yellow-500/50 transition-all group flex flex-col">
                        <Icon className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{service.shortDesc}</p>
                        <button 
                            onClick={() => setSelectedService(service)}
                            className="w-full bg-slate-800 hover:bg-white hover:text-slate-900 text-white font-bold py-2 rounded text-sm transition-colors border border-slate-700"
                        >
                            Request Service
                        </button>
                    </div>
                );
            })}
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

    {/* Modal Overlay */}
    {selectedService && (
        <ServiceRequestModal 
            service={selectedService} 
            onClose={() => setSelectedService(null)} 
        />
    )}
  </div>
  );
};

// --- INSPECTION BOOKING PAGE (FIXED VALIDATION) ---
const InspectionBookingPage = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(1);
    
    const [bookingData, setBookingData] = useState({
        machineType: 'Excavator',
        location: '',
        contactPerson: '',
        phone: '',
        date: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setBookingData({...bookingData, [e.target.name]: e.target.value});
    };

    // Validation Check for Step 1
    const canProceedToStep2 = () => {
        return bookingData.location.length > 2; // Basic check ensuring location is filled
    };

    const canSubmit = () => {
        return bookingData.contactPerson.length > 2 && bookingData.phone.length > 9 && bookingData.date !== '';
    };

    const submitBooking = async () => {
        if (!canSubmit()) {
            alert("Please fill in all contact details and date.");
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/book-inspection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            
            if (response.ok) {
                setStep(3); 
            } else {
                alert("Failed to book inspection. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error. Is the backend running?");
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-950 py-16 px-4">
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-yellow-500 p-6">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center"><Search className="mr-3"/> BOOK INSPECTION</h2>
                    <p className="text-slate-900/80 font-medium">Schedule a certified engineer to inspect your machinery.</p>
                </div>
                
                {/* Progress Bar */}
                <div className="flex border-b border-slate-800">
                    <div className={`flex-1 py-3 text-center text-sm font-bold ${step >= 1 ? 'text-yellow-500 bg-slate-800' : 'text-slate-600'}`}>1. Machine</div>
                    <div className={`flex-1 py-3 text-center text-sm font-bold ${step >= 2 ? 'text-yellow-500 bg-slate-800' : 'text-slate-600'}`}>2. Contact</div>
                    <div className={`flex-1 py-3 text-center text-sm font-bold ${step >= 3 ? 'text-yellow-500 bg-slate-800' : 'text-slate-600'}`}>3. Confirm</div>
                </div>
                
                {step === 1 && (
                    <div className="p-8 space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Step 1: Machine Details</h3>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Machine Type</label>
                            <select 
                                name="machineType"
                                value={bookingData.machineType}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-4"
                            >
                                <option>Excavator</option>
                                <option>Truck</option>
                                <option>Generator</option>
                                <option>Backhoe Loader</option>
                                <option>Grader</option>
                                <option>Other</option>
                            </select>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Location of Machine</label>
                            <input 
                                name="location"
                                value={bookingData.location}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" 
                                placeholder="e.g. Athi River Site" 
                            />
                        </div>
                        <button 
                            onClick={() => {
                                if (canProceedToStep2()) setStep(2);
                                else alert("Please enter the machine location.");
                            }} 
                            className={`w-full font-bold py-3 rounded transition-colors ${canProceedToStep2() ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-8 space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Step 2: Contact Info</h3>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Contact Person</label>
                            <input 
                                name="contactPerson"
                                value={bookingData.contactPerson}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-4" 
                                placeholder="Full Name" 
                            />
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Phone Number</label>
                            <input 
                                name="phone"
                                value={bookingData.phone}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-4" 
                                placeholder="0700 000 000" 
                            />
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Preferred Date</label>
                            <input 
                                name="date"
                                value={bookingData.date}
                                onChange={handleChange}
                                type="date" 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" 
                            />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 bg-slate-800 text-white font-bold py-3 rounded hover:bg-slate-700">Back</button>
                            <button 
                                onClick={submitBooking} 
                                className={`flex-1 font-bold py-3 rounded transition-colors ${canSubmit() ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6 text-white"><Check size={40}/></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Inspection Booked!</h3>
                        <p className="text-slate-400 mb-6">Order #INSP-{Math.floor(Math.random()*1000)}. Status: <span className="text-yellow-500 font-bold">PENDING</span>.<br/>Our team will confirm availability within 2 hours.</p>
                        <button onClick={onComplete} className="bg-slate-800 text-white px-8 py-3 rounded font-bold hover:bg-slate-700">Return Home</button>
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

// --- OPERATOR PORTAL (Moved to end for clarity) ---
const OperatorPortal = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: (log: OperatorLog) => void }) => {
    // Stage 1: Auth, Stage 2: Log Entry
    const [authStep, setAuthStep] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [token, setToken] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        machineId: '',
        startTime: '', // Changed to Time String
        endTime: '',   // Changed to Time String
        currentReading: '', // New: The cumulative meter reading
        readingUnit: 'Kilometers (km)', // New: Unit selector
        fuel: '',
        location: '',
        notes: '',
        checklist: { tires: false, oil: false, hydraulics: false, brakes: false }
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (response.ok) { setToken(data.access_token); setAuthStep(false); } 
            else { alert(data.detail || "Login failed."); }
        } catch (error) { alert("Connection error."); } 
        finally { setIsLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.startTime || !formData.endTime) { alert("Please enter start and end times."); return; }
        
        const payload = {
            id: `LOG-${Date.now()}`,
            machineId: formData.machineId,
            operatorName: credentials.username, 
            date: new Date().toISOString().split('T')[0],
            startTime: formData.startTime, 
            endTime: formData.endTime,
            // We use 'startOdometer' field to send the CURRENT cumulative reading
            startOdometer: parseFloat(formData.currentReading) || 0, 
            // We use 'endOdometer' to send the Unit type (hack to avoid changing DB schema too much)
            // ideally we send a new field, but let's stick to the structure or send it as a note
            endOdometer: 0, 
            fuelAddedLiters: parseFloat(formData.fuel) || 0,
            location: formData.location,
            checklist: formData.checklist,
            // We append the unit to notes so backend can parse it safely
            notes: `${formData.notes} [UNIT:${formData.readingUnit}]` 
        };

        try {
            const response = await fetch('http://localhost:8000/api/operator-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) { onSubmit(payload as any); onBack(); } 
            else { alert("Failed to submit log."); }
        } catch (error) { alert("Network error."); }
    };

    const toggleCheck = (key: keyof typeof formData.checklist) => {
        setFormData(prev => ({ ...prev, checklist: { ...prev.checklist, [key]: !prev.checklist[key] } }));
    };

    if (authStep) {
        // ... (Login UI remains the same as before)
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                {/* Same Login UI Code from previous step... just simpler here for brevity */}
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Operator Login</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Username" onChange={e=>setCredentials({...credentials, username: e.target.value})}/>
                        <input type="password" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Password" onChange={e=>setCredentials({...credentials, password: e.target.value})}/>
                        <button disabled={isLoading} className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded">Login</button>
                    </form>
                    <button onClick={onBack} className="w-full text-center text-slate-500 mt-4">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center"><ClipboardCheck className="mr-2 text-yellow-500"/> Daily Log</h2>
                    <button onClick={onBack} className="text-slate-400 hover:text-white"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Machine Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Machine ID / Plate</label>
                            <input required className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500" 
                                placeholder="e.g. KCD 892J" value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Site Location</label>
                            <input required className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500" 
                                placeholder="e.g. Athi River" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                        </div>
                    </div>

                    {/* NEW: Time & Meter Reading */}
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                        <h3 className="text-white font-bold text-sm mb-4 flex items-center"><Activity size={16} className="mr-2 text-blue-500"/> Time & Meter Reading</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">Start Time</label>
                                <input required type="time" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                    value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">End Time</label>
                                <input required type="time" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                    value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">Current Meter Reading</label>
                                <input required type="number" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white font-bold" 
                                    placeholder="e.g. 12500" value={formData.currentReading} onChange={e => setFormData({...formData, currentReading: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">Reading Unit</label>
                                <select className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white"
                                    value={formData.readingUnit} onChange={e => setFormData({...formData, readingUnit: e.target.value})}>
                                    <option value="km">Kilometers (km)</option>
                                    <option value="mi">Miles (mi)</option>
                                    <option value="hrs">Engine Hours (hrs)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">Fuel Added (L)</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                    value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    {/* Safety Checklist */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4 flex items-center"><ShieldCheck size={16} className="mr-2 text-green-500"/> Pre-Start Safety Check</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['Tires/Tracks', 'Engine Oil', 'Hydraulics', 'Brakes'].map((label, i) => {
                                const key = Object.keys(formData.checklist)[i] as keyof typeof formData.checklist;
                                return (
                                    <button key={key} type="button" onClick={() => toggleCheck(key)}
                                        className={`p-3 rounded border flex flex-col items-center justify-center transition-all ${formData.checklist[key] ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-slate-950 border-slate-700 text-slate-500'}`}>
                                        <span className="text-xs font-bold">{label}</span>
                                        <div className={`w-3 h-3 rounded-full mt-2 ${formData.checklist[key] ? 'bg-green-500' : 'bg-slate-800'}`}></div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Operational Notes</label>
                        <textarea className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white h-20 text-sm" 
                            placeholder="Issues, delays, or maintenance requests..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <button type="submit" className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded hover:bg-yellow-400 shadow-lg flex items-center justify-center">
                            <FileBadge className="mr-2" size={20}/> Submit Daily Log
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ... (Rest of existing components like EquipmentPage, SparePartsPage etc remain unchanged for now)
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
                                <button 
                                    onClick={async () => {
                                        const name = prompt("Enter your name:");
                                        const phone = prompt("Enter your phone number:");
                                        const dur = prompt("Duration (e.g. 3 days):");
                                        if(name && phone) {
                                            try {
                                                await fetch('http://localhost:8000/api/lease-request', {
                                                    method: 'POST',
                                                    headers: {'Content-Type': 'application/json'},
                                                    body: JSON.stringify({
                                                        machineName: selectedItem.name,
                                                        machineId: selectedItem.id,
                                                        customerName: name,
                                                        phone: phone,
                                                        duration: dur || "Indefinite"
                                                    })
                                                });
                                                alert("Lease inquiry sent to admin!");
                                            } catch(e) {
                                                alert("Failed to send inquiry. Server offline?");
                                            }
                                        }
                                    }} 
                                    className="bg-slate-700 text-white font-bold py-3 rounded hover:bg-slate-600"
                                >
                                    Lease
                                </button>
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

// --- PROFESSIONALS PAGE (UPDATED) ---
const ProfessionalsPage = () => {
    const [filterRole, setFilterRole] = useState('All');
    const [selectedPro, setSelectedPro] = useState<ProfessionalProfile | null>(null);
    
    // Updated Role List including Mechanical Engineer
    const roles = ['All', 'Civil Engineer', 'Structural Engineer', 'Mechanical Engineer', 'Software Engineer', 'Welder', 'Mechanic', 'Operator', 'Driver'];
    
    // Filter logic - strict equality to match the distinct roles in constants.ts
    const filteredPros = filterRole === 'All' ? PROFESSIONALS : PROFESSIONALS.filter(p => p.role === filterRole);

    // Professional Profile Modal
    const ProfessionalModal = () => {
        if(!selectedPro) return null;
        return (
            <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
                <div className="bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]">
                    <button onClick={() => setSelectedPro(null)} className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors"><X size={20}/></button>
                    
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative border-b border-slate-800">
                        {/* Avatar */}
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800">
                                {selectedPro.image ? <img src={selectedPro.image} className="w-full h-full object-cover"/> : 
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-2xl">{selectedPro.name.charAt(0)}</div>}
                            </div>
                        </div>
                        {selectedPro.verified && (
                            <div className="absolute -bottom-10 left-24 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center border border-slate-900 shadow-sm" title="DAGIV Verified">
                                <BadgeCheck size={12} className="mr-1"/> Verified
                            </div>
                        )}
                    </div>

                    <div className="pt-16 px-8 pb-8 overflow-y-auto custom-scrollbar">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white flex items-center">{selectedPro.name}</h2>
                                <p className="text-yellow-500 font-bold uppercase text-sm tracking-wider flex items-center gap-2 mt-1">
                                    {selectedPro.role} <span className="text-slate-600">•</span> {selectedPro.specialization}
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                                    <span className="flex items-center"><MapPin size={14} className="mr-1"/> {selectedPro.location}</span>
                                    <span className="flex items-center"><Briefcase size={14} className="mr-1"/> {selectedPro.yearsExperience} Years Exp.</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end">
                                <div className="text-2xl font-bold text-white flex items-center gap-1">
                                    {selectedPro.rating} <Star className="fill-yellow-500 text-yellow-500" size={20}/>
                                </div>
                                <span className="text-slate-500 text-xs">{selectedPro.reviews?.length || 0} Verified Reviews</span>
                            </div>
                        </div>

                        {/* Bio & Certs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="md:col-span-2">
                                <h3 className="text-white font-bold mb-3 border-b border-slate-800 pb-2">About</h3>
                                <p className="text-slate-300 leading-relaxed text-sm">{selectedPro.bio}</p>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-3 border-b border-slate-800 pb-2">Certifications</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPro.certifications?.map((cert, i) => (
                                        <span key={i} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded flex items-center">
                                            <Shield size={10} className="mr-1 text-green-500"/> {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Portfolio */}
                        <div className="mb-8">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <FileBarChart size={18} className="text-yellow-500"/> Project Portfolio
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {selectedPro.portfolio?.length > 0 ? selectedPro.portfolio.map((img, i) => (
                                    // FIXED: Made "View Project" clickable (Opens image in new tab)
                                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-slate-800 h-32 group relative cursor-pointer">
                                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-xs font-bold border border-white px-2 py-1 rounded flex items-center">
                                                <Search size={12} className="mr-1"/> View Project
                                            </span>
                                        </div>
                                    </a>
                                )) : <p className="text-slate-500 text-sm italic">No portfolio items uploaded.</p>}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div>
                            <h3 className="text-white font-bold mb-4">Client Reviews</h3>
                            <div className="space-y-4">
                                {selectedPro.reviews?.map((review) => (
                                    <div key={review.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center">
                                                <span className="text-white font-bold text-sm">{review.user}</span>
                                                {review.verifiedClient && (
                                                    <span className="ml-2 bg-green-900/30 text-green-400 text-[10px] px-1.5 py-0.5 rounded border border-green-900/50 flex items-center">
                                                        <CheckCircle size={10} className="mr-1"/> Verified Client
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-slate-500 text-xs">{review.date}</span>
                                        </div>
                                        <div className="flex text-yellow-500 gap-0.5 mb-2">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                                        </div>
                                        <p className="text-slate-400 text-sm italic">"{review.comment}"</p>
                                    </div>
                                ))}
                                {selectedPro.reviews?.length === 0 && <p className="text-slate-500 text-sm">No reviews yet.</p>}
                            </div>
                        </div>

                        {/* FIXED: Contact Button now calls Admin */}
                        <div className="sticky bottom-0 pt-6 mt-6 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs text-slate-500">
                                <Info size={12} className="inline mr-1 text-yellow-500"/>
                                For security, all bookings are handled via the DAGIV Central Admin.
                            </p>
                            <a 
                                href="tel:+254704385809" 
                                className="w-full md:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded transition-colors shadow-lg flex items-center justify-center"
                            >
                                <Phone size={18} className="mr-2"/> Call Admin to Book
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4">
            <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-4xl font-bold text-white mb-2">Professionals Hub</h2>
                    <p className="text-slate-400 text-sm">Hire verified engineers, operators, and fabricators.</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center md:justify-end">
                    {roles.map(r => (
                        <button 
                            key={r} 
                            onClick={() => setFilterRole(r)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filterRole === r ? 'bg-yellow-500 text-slate-900 transform scale-105 shadow-lg' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-yellow-500'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPros.map(prof => (
                <div key={prof.id} className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-center hover:border-yellow-500/50 transition-all group hover:-translate-y-1 relative overflow-hidden shadow-lg">
                    {/* Verified Badge (Corner) */}
                    {prof.verified && (
                        <div className="absolute top-3 right-3 text-blue-500 bg-slate-900 rounded-full p-1 border border-slate-800 shadow-sm" title="Verified Professional">
                            <BadgeCheck size={20} />
                        </div>
                    )}
                    
                    <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl overflow-hidden relative border-2 border-slate-700 group-hover:border-yellow-500 transition-colors">
                        {prof.image ? <img src={prof.image} alt={prof.name} className="w-full h-full object-cover" /> : <span className="text-slate-500 font-bold">{prof.name.charAt(0)}</span>}
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight">{prof.name}</h3>
                    <p className="text-yellow-500 text-xs font-bold uppercase mb-1 mt-1">{prof.role}</p>
                    <p className="text-slate-500 text-xs mb-3">{prof.specialization}</p>
                    
                    <div className="flex justify-center gap-1 mb-4 text-yellow-500">
                        {[...Array(5)].map((_,i) => <Star key={i} size={14} fill={i < Math.floor(prof.rating) ? "currentColor" : "none"} />)}
                        <span className="text-slate-600 text-xs ml-1">({prof.reviews?.length || 0})</span>
                    </div>
                    
                    <div className="border-t border-slate-800 pt-4 mt-4">
                        <button onClick={() => setSelectedPro(prof)} className="w-full bg-slate-800 text-white py-2 rounded text-sm hover:bg-white hover:text-slate-900 font-bold transition-colors border border-slate-700">
                            View Profile & Portfolio
                        </button>
                    </div>
                </div>
                ))}
            </div>
            
            {filteredPros.length === 0 && (
                 <div className="text-center py-20">
                     <p className="text-slate-500">No professionals found for this category yet.</p>
                 </div>
            )}
            </div>
            <ProfessionalModal />
        </div>
    );
};

// --- CONSULT PAGE (AI Removed - Professional Only) ---
const ConsultPage = () => {
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS'>('IDLE');
  const [humanForm, setHumanForm] = useState({
      name: '',
      phone: '',
      type: 'General Technical Advice (Free)',
      details: ''
  });

  const handleHumanSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus('SUBMITTING');
      
      const payload = {
          name: humanForm.name,
          phone: humanForm.phone,
          type: humanForm.type,
          details: humanForm.details
      };

      try {
          const res = await fetch('http://localhost:8000/api/consultation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (res.ok) setFormStatus('SUCCESS');
          else {
              alert("Failed to submit request.");
              setFormStatus('IDLE');
          }
      } catch (e) {
          console.error(e);
          alert("Error sending request. Is the server online?");
          setFormStatus('IDLE');
      }
  };

  return (
     <div className="min-h-screen bg-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">Engineering Consultation</h2>
                <p className="text-slate-400">Schedule a session with a certified professional engineer for site inspections, valuations, or technical advice.</p>
            </div>

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
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none" 
                                    required 
                                    value={humanForm.name}
                                    onChange={(e) => setHumanForm({...humanForm, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Phone (WhatsApp)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none" 
                                    placeholder="+254..." 
                                    required 
                                    value={humanForm.phone}
                                    onChange={(e) => setHumanForm({...humanForm, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Consultation Type</label>
                            <select 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none"
                                value={humanForm.type}
                                onChange={(e) => setHumanForm({...humanForm, type: e.target.value})}
                            >
                                <option>General Technical Advice (Free)</option>
                                <option>Site Inspection Request (Paid)</option>
                                <option>Machine Valuation (Paid)</option>
                                <option>Project Feasibility Study (Paid)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Project / Machine Details</label>
                            <textarea 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none h-32" 
                                required 
                                placeholder="Describe your issue or requirement..."
                                value={humanForm.details}
                                onChange={(e) => setHumanForm({...humanForm, details: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="flex items-center gap-4">
                            <button type="submit" disabled={formStatus === 'SUBMITTING'} className="flex-1 bg-yellow-500 text-slate-900 font-bold py-4 rounded hover:bg-yellow-400 transition-colors">
                                {formStatus === 'SUBMITTING' ? 'Scheduling...' : 'SCHEDULE CONSULTATION'}
                            </button>
                            <a 
                                href="tel:0704385809" 
                                className="px-6 py-4 bg-green-600 text-white font-bold rounded hover:bg-green-500 flex items-center transition-colors"
                            >
                                <Phone className="mr-2" size={20} /> Call Now
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
     </div>
  );
};

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

export default App;