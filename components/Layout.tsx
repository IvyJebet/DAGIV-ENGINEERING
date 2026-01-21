import React, { useState } from 'react';
import { PageView } from '../types';
import { Menu, X, Phone, User, ShoppingCart, Activity, Truck, Wrench, Search } from 'lucide-react';

interface NavProps {
  currentPage: PageView;
  setPage: (page: PageView) => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavProps> = ({ currentPage, setPage, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Updated Navigation Items to match new Marketplace Structure
  const navItems = [
    { label: 'Home', value: PageView.HOME },
    { label: 'Services', value: PageView.SERVICES },
    { label: 'Buy Equipment', value: PageView.MARKETPLACE_BUY }, // Updated
    { label: 'Plant Hire', value: PageView.MARKETPLACE_RENT },   // New
    { label: 'Spare Parts', value: PageView.SPARE_PARTS },
    { label: 'Professionals', value: PageView.PROFESSIONALS },
    { label: 'Consult', value: PageView.CONSULT },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={() => setPage(PageView.HOME)}>
            <div className="h-10 w-10 bg-yellow-500 rounded flex items-center justify-center mr-3 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <Activity className="text-slate-900 h-6 w-6 font-bold" />
            </div>
            <div>
              <span className="text-white font-black text-xl tracking-tighter block group-hover:text-slate-200 transition-colors">DAGIV</span>
              <span className="text-yellow-500 text-xs font-bold tracking-widest block group-hover:text-yellow-400 transition-colors">ENGINEERING</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setPage(item.value)}
                  className={`px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition-all ${
                    currentPage === item.value
                      ? 'text-yellow-500 bg-slate-900 shadow-inner border-b-2 border-yellow-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Actions (ERP & Login) */}
          <div className="hidden md:flex items-center space-x-4">
             <button 
                onClick={() => setPage(PageView.ERP)}
                className="text-yellow-500 font-bold text-xs px-4 py-2 border border-yellow-500/30 rounded hover:bg-yellow-500/10 transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(234,179,8,0.1)] hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]"
             >
                <Activity size={14} /> ERP LOGIN
             </button>
             <button 
                onClick={onLoginClick} 
                className="bg-slate-800 p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all"
                title="Operator Login"
             >
                <User size={18} />
             </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-900 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none border border-slate-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 animate-in slide-in-from-top-5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { setPage(item.value); setIsOpen(false); }}
                className={`block px-3 py-3 rounded-md text-base font-bold w-full text-left flex items-center ${
                    currentPage === item.value 
                    ? 'text-yellow-500 bg-slate-900 border-l-4 border-yellow-500' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label === 'Buy Equipment' && <ShoppingCart size={16} className="mr-3"/>}
                {item.label === 'Plant Hire' && <Truck size={16} className="mr-3"/>}
                {item.label === 'Services' && <Wrench size={16} className="mr-3"/>}
                {item.label === 'Professionals' && <User size={16} className="mr-3"/>}
                {item.label === 'Consult' && <Search size={16} className="mr-3"/>}
                {item.label}
              </button>
            ))}
             <button
                onClick={() => { setPage(PageView.ERP); setIsOpen(false); }}
                className="text-slate-900 bg-yellow-500 font-black uppercase tracking-wider block px-3 py-3 rounded-md text-base w-full text-center mt-4 shadow-lg hover:bg-yellow-400"
              >
                ACCESS ERP DASHBOARD
              </button>
              <button
                onClick={() => { onLoginClick(); setIsOpen(false); }}
                className="text-slate-300 bg-slate-800 font-bold uppercase tracking-wider block px-3 py-3 rounded-md text-base w-full text-center mt-2 border border-slate-700"
              >
                OPERATOR LOGIN
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC<{ setPage: (p: PageView) => void }> = ({ setPage }) => (
  <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-4">
             <div className="h-8 w-8 bg-yellow-500 rounded flex items-center justify-center mr-2 shadow-[0_0_10px_rgba(234,179,8,0.4)]">
              <span className="text-slate-900 font-black text-lg">D</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight">DAGIV ENGINEERING</span>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Kenya's premier partner for heavy machinery reliability. Inspect. Lease. Maintain.
          </p>
          <div className="flex space-x-4">
            {/* Social Icons (Placeholders) */}
            <div className="w-8 h-8 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-yellow-500 hover:text-slate-900 hover:border-yellow-500 cursor-pointer transition-all">fb</div>
            <div className="w-8 h-8 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-yellow-500 hover:text-slate-900 hover:border-yellow-500 cursor-pointer transition-all">in</div>
            <div className="w-8 h-8 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-yellow-500 hover:text-slate-900 hover:border-yellow-500 cursor-pointer transition-all">tw</div>
          </div>
        </div>
        
        {/* Solutions Column */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Solutions</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => setPage(PageView.SERVICES)}>Inspection & Audit</li>
            <li className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => setPage(PageView.MARKETPLACE_RENT)}>Plant Leasing</li>
            <li className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => setPage(PageView.SERVICES)}>Fleet Maintenance</li>
            <li className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => setPage(PageView.ERP)}>Mechanical ERP</li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Marketplace</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => setPage(PageView.MARKETPLACE_BUY)}>Buy Machinery</li>
            <li className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => setPage(PageView.SPARE_PARTS)}>Spare Parts</li>
            <li className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => setPage(PageView.PROFESSIONALS)}>Find an Engineer</li>
            <li className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => setPage(PageView.CONSULT)}>Book Consultation</li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Contact</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center group">
                <span className="text-yellow-500 mr-3 bg-yellow-500/10 p-1 rounded">📍</span> 
                <a href="http://maps.google.com/?q=Industrial+Area,Enterprise+Rd,Nairobi" target="_blank" rel="noopener noreferrer" className="group-hover:text-white transition-colors">
                    Industrial Area, Enterprise Rd, Nairobi
                </a>
            </li>
            <li className="flex items-center group">
                <span className="text-yellow-500 mr-3 bg-yellow-500/10 p-1 rounded">📞</span> 
                <a href="tel:+254700000000" className="group-hover:text-white transition-colors font-mono">
                    +254 700 000 000
                </a>
            </li>
            <li className="flex items-center group">
                <span className="text-yellow-500 mr-3 bg-yellow-500/10 p-1 rounded">✉️</span> 
                <a href="mailto:info@dagiv.co.ke" className="group-hover:text-white transition-colors">
                    info@dagiv.co.ke
                </a>
            </li>
            <li className="flex items-center">
                <span className="text-yellow-500 mr-3 bg-yellow-500/10 p-1 rounded">🕐</span> 
                <span>Mon - Sat: 8:00 - 18:00</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
        <div>© {new Date().getFullYear()} DAGIV ENGINEERING LTD. All Rights Reserved.</div>
        <div className="mt-2 md:mt-0 flex space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Sitemap</span>
        </div>
      </div>
    </div>
  </footer>
);