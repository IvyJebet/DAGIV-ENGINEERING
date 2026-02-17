import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
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
            World's Mechanical partner for heavy machinery reliability. Inspect. Lease. Maintain.
          </p>
        </div>
        
        {/* Solutions Column */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Solutions</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/services" className="hover:text-yellow-500 transition-colors">Inspection & Audit</Link></li>
            <li><Link to="/rentals" className="hover:text-yellow-500 transition-colors">Plant Leasing</Link></li>
            <li><Link to="/services" className="hover:text-yellow-500 transition-colors">Fleet Maintenance</Link></li>
            <li><Link to="/erp" className="hover:text-yellow-500 transition-colors">Mechanical ERP</Link></li>
          </ul>
        </div>

        {/* Quick Links Column - FIXED: Now uses Link instead of setPage */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Marketplace</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/marketplace" className="hover:text-yellow-500 transition-colors">Buy Machinery</Link></li>
            <li><Link to="/parts" className="hover:text-yellow-500 transition-colors">Spare Parts</Link></li>
            <li><Link to="/professionals" className="hover:text-yellow-500 transition-colors">Find an Engineer</Link></li>
            <li><Link to="/consult" className="hover:text-yellow-500 transition-colors">Book Consultation</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Contact</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center group cursor-pointer">
                <span className="text-yellow-500 mr-3 bg-yellow-500/10 p-1 rounded">📍</span> 
                <a href="http://maps.google.com/?q=Industrial+Area,Enterprise+Rd,Nairobi" target="_blank" rel="noopener noreferrer" className="group-hover:text-yellow-500 transition-colors">
                    Industrial Area, Enterprise Rd, Nairobi
                </a>
            </li>
            <li className="flex items-center group cursor-pointer">
                <span className="text-yellow-500 mr-3 bg-yellow-500/10 p-1 rounded">📞</span> 
                <a href="tel:+254704385809" className="group-hover:text-yellow-500 transition-colors font-mono">
                    +254 704 385 809
                </a>
            </li>
            <li className="flex items-center group cursor-pointer">
                <span className="text-yellow-500 mr-3 bg-yellow-500/10 p-1 rounded">✉️</span> 
                <a href="mailto:dagivengineering@gmail.com" className="group-hover:text-yellow-500 transition-colors">
                    dagivengineering@gmail.com
                </a>
            </li>
            <li className="flex items-center">
                <span className="text-yellow-500 mr-3 bg-yellow-500/10 p-1 rounded">🕐</span> 
                <span>Mon - Sat: 8:00 - 17:00</span>
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