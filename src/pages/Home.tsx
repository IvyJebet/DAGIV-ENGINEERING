import React, { useState } from 'react';
import { 
  MapPin, ShoppingCart, Search, Truck, Wrench, Activity, 
  BadgeCheck, Users, ShieldCheck, CheckCircle, FileBadge, HardHat, Check 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceDetail } from '@/types'; 
import { SERVICES_CONTENT } from '@/config/constants';
import { ServiceRequestModal } from '@/features/services/components/ServiceRequestModal';

interface HomePageProps {
  setPage: (p: any) => void;
  onBookInspection: () => void;
  onSellClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, onBookInspection, onSellClick }) => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const navigate = useNavigate();

  return (
  <div className="flex flex-col">
    {/* Hero Section */}
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80" 
          alt="Construction in the World" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-block px-4 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6 backdrop-blur-sm">
          <span className="text-yellow-500 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
             <MapPin size={14} /> World's trusted Mechanical Partner
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
          PREMIUM EQUIPMENT & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            ENGINEERING SOLUTIONS
          </span>
        </h1>
        <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
          From pre-purchase inspections and commissioning to computer diagnosis and maintenance to logistics and leasing of machinery, DAGIV ENGINEERING delivers comprehensive mechanical solutions for your business needs.
        </p>
        
        {/* QUICK ACTION GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {/* BUTTON 1: SELL MACHINERY */}
            <button 
                onClick={onSellClick}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <ShoppingCart size={24} />
                </div>
                <span className="text-white font-bold text-sm">Sell Machinery</span>
            </button>

            {/* BUTTON 2: BOOK INSPECTION */}
            <button 
                onClick={onBookInspection}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <Search size={24} />
                </div>
                <span className="text-white font-bold text-sm">Book Inspection</span>
            </button>

            {/* BUTTON 3: LEASE FLEET */}
            <button 
                onClick={() => navigate('/rentals')}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <Truck size={24} />
                </div>
                <span className="text-white font-bold text-sm">Lease Fleet</span>
            </button>

            {/* BUTTON 4: MAINTENANCE */}
            <button 
                onClick={() => navigate('/services')}
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
                <p className="text-slate-400 max-w-2xl mx-auto">Built on integrity, powered by expertise. We are setting new standards for mechanical engineering in the world.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                <div className="text-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-colors">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 shadow-inner border border-slate-800">
                        <Activity size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
                    <p className="text-slate-400 text-sm">To be the undisputed leader in industrial engineering solutions across the world, driving infrastructure growth through reliability.</p>
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
                    <p className="text-slate-400 text-sm">Empowering local industries, upskilling World's engineers, and delivering sustainable mechanical solutions.</p>
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

    {/* Core Services Preview */}
    <div className="py-24 bg-slate-900">
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
        {/* Background Pattern - FIXED: Replaced inline style with Tailwind arbitrary values */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#eab308_1px,transparent_1px)] bg-[length:30px_30px]"></div>
        
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
                        onClick={() => navigate('/erp')}
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

export default HomePage;