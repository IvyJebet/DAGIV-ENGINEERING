
import React, { useState } from 'react';
import { PageView } from '../types';
import { Menu, X, Phone, User, ShoppingCart, Activity } from 'lucide-react';

interface NavProps {
  currentPage: PageView;
  setPage: (page: PageView) => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavProps> = ({ currentPage, setPage, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', value: PageView.HOME },
    { label: 'Services', value: PageView.SERVICES },
    { label: 'Equipment', value: PageView.EQUIPMENT },
    { label: 'Spare Parts', value: PageView.SPARE_PARTS },
    { label: 'Professionals', value: PageView.PROFESSIONALS },
    { label: 'Consult', value: PageView.CONSULT },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setPage(PageView.HOME)}>
            <div className="h-10 w-10 bg-yellow-500 rounded flex items-center justify-center mr-3">
              <Activity className="text-slate-900 h-6 w-6 font-bold" />
            </div>
            <div>
              <span className="text-white font-black text-xl tracking-tighter block">DAGIV</span>
              <span className="text-yellow-500 text-xs font-bold tracking-widest block">ENGINEERING</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setPage(item.value)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.value
                      ? 'text-yellow-500 bg-slate-900'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
             <button 
                onClick={() => setPage(PageView.ERP)}
                className="text-yellow-500 font-bold text-sm px-4 py-2 border border-yellow-500/30 rounded hover:bg-yellow-500/10 transition-colors flex items-center gap-2"
             >
                <Activity size={16} /> ERP LOGIN
             </button>
             <button onClick={onLoginClick} className="bg-slate-800 p-2 rounded-full text-slate-300 hover:text-white">
                <User size={20} />
             </button>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-900 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { setPage(item.value); setIsOpen(false); }}
                className="text-slate-300 hover:text-white hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {item.label}
              </button>
            ))}
             <button
                onClick={() => { setPage(PageView.ERP); setIsOpen(false); }}
                className="text-yellow-500 font-bold block px-3 py-2 rounded-md text-base w-full text-left mt-4"
              >
                ACCESS ERP DASHBOARD
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
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-4">
             <div className="h-8 w-8 bg-yellow-500 rounded flex items-center justify-center mr-2">
              <span className="text-slate-900 font-bold text-lg">D</span>
            </div>
            <span className="text-white font-bold text-lg">DAGIV ENGINEERING</span>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Kenya's premier partner for heavy machinery reliability. Inspect. Lease. Maintain.
          </p>
          <div className="flex space-x-4">
            {/* Social Icons Placeholders */}
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-yellow-500 hover:text-slate-900 cursor-pointer transition-colors">fb</div>
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-yellow-500 hover:text-slate-900 cursor-pointer transition-colors">in</div>
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-yellow-500 hover:text-slate-900 cursor-pointer transition-colors">tw</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4">Solutions</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="hover:text-yellow-500 cursor-pointer" onClick={() => setPage(PageView.SERVICES)}>Inspection & Audit</li>
            <li className="hover:text-yellow-500 cursor-pointer" onClick={() => setPage(PageView.SERVICES)}>Plant Leasing</li>
            <li className="hover:text-yellow-500 cursor-pointer" onClick={() => setPage(PageView.SERVICES)}>Fleet Maintenance</li>
            <li className="hover:text-yellow-500 cursor-pointer" onClick={() => setPage(PageView.ERP)}>Mechanical ERP</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="hover:text-yellow-500 cursor-pointer" onClick={() => setPage(PageView.EQUIPMENT)}>Equipment Catalog</li>
            <li className="hover:text-yellow-500 cursor-pointer" onClick={() => setPage(PageView.SPARE_PARTS)}>Spare Parts Market</li>
            <li className="hover:text-yellow-500 cursor-pointer" onClick={() => setPage(PageView.PROFESSIONALS)}>Find an Engineer</li>
            <li className="hover:text-yellow-500 cursor-pointer" onClick={() => setPage(PageView.CONSULT)}>Book Consultation</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center group">
                <span className="text-yellow-500 mr-2">📍</span> 
                <a href="https://maps.google.com/?q=Industrial+Area,+Enterprise+Rd,+Nairobi" target="_blank" rel="noopener noreferrer" className="group-hover:text-yellow-500 transition-colors">
                    Industrial Area, Enterprise Rd, Nairobi
                </a>
            </li>
            <li className="flex items-center group">
                <span className="text-yellow-500 mr-2">📞</span> 
                <a href="tel:+254700000000" className="group-hover:text-yellow-500 transition-colors">
                    +254 700 000 000
                </a>
            </li>
            <li className="flex items-center group">
                <span className="text-yellow-500 mr-2">✉️</span> 
                <a href="mailto:info@dagiv.co.ke" className="group-hover:text-yellow-500 transition-colors">
                    info@dagiv.co.ke
                </a>
            </li>
            <li className="flex items-center"><span className="text-yellow-500 mr-2">🕐</span> Mon - Sat: 8:00 - 18:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-900 mt-12 pt-8 text-center text-slate-600 text-sm">
        &copy; {new Date().getFullYear()} DAGIV ENGINEERING LTD. All Rights Reserved.
      </div>
    </div>
  </footer>
);
