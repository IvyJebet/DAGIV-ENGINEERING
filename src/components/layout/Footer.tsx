import React from 'react';
import { Link } from 'react-router-dom';
// Removed Twitter from the lucide-react import
import { Shield, MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Socials */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-yellow-500 p-2 rounded-lg shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                <Shield className="text-slate-900" size={24} />
              </div>
              <span className="text-xl font-black text-white tracking-tight">DAGIV<span className="text-yellow-500">.</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The premier industrial marketplace for heavy machinery, parts, and certified professionals around the world.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Visit our Facebook page" title="Facebook" className="text-slate-500 hover:text-yellow-500 transition-colors">
                <Facebook size={20} />
              </a>
              
              {/* Replaced <Twitter /> with the official X logo SVG */}
              <a href="#" aria-label="Visit our X page" title="X" className="text-slate-500 hover:text-yellow-500 transition-colors">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a href="#" aria-label="Visit our Instagram page" title="Instagram" className="text-slate-500 hover:text-yellow-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Visit our LinkedIn page" title="LinkedIn" className="text-slate-500 hover:text-yellow-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Platform Links (Restored React Router Links) */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/marketplace" className="text-slate-400 hover:text-yellow-500 transition-colors text-sm">Buy Equipment</Link></li>
              <li><Link to="/rentals" className="text-slate-400 hover:text-yellow-500 transition-colors text-sm">Plant Hire</Link></li>
              <li><Link to="/parts" className="text-slate-400 hover:text-yellow-500 transition-colors text-sm">Spare Parts</Link></li>
              <li><Link to="/professionals" className="text-slate-400 hover:text-yellow-500 transition-colors text-sm">Professional Hub</Link></li>
              <li><Link to="/consult" className="text-slate-400 hover:text-yellow-500 transition-colors text-sm">Book Consultation</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Services</h3>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-slate-400 hover:text-yellow-500 transition-colors text-sm">Site Inspections</Link></li>
              <li><Link to="/erp" className="text-slate-400 hover:text-yellow-500 transition-colors text-sm">Fleet ERP System</Link></li>
              <li><span className="text-slate-400 hover:text-yellow-500 transition-colors text-sm cursor-pointer">Escrow Payments</span></li>
              <li><span className="text-slate-400 hover:text-yellow-500 transition-colors text-sm cursor-pointer">Logistics Tracking</span></li>
            </ul>
          </div>

          {/* Contact Us (Restored Business Hours) */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                <a href="http://maps.google.com/?q=Industrial+Area,Enterprise+Rd,Nairobi" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors">
                  Industrial Area, Enterprise Rd<br />Nairobi, Kenya
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={18} className="text-yellow-500 shrink-0" />
                <a href="tel:+254704385809" className="hover:text-yellow-500 transition-colors font-mono">+254 704 385 809</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={18} className="text-yellow-500 shrink-0" />
                <a href="mailto:dagivengineering@gmail.com" className="hover:text-yellow-500 transition-colors">dagivengineering@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Clock size={18} className="text-yellow-500 shrink-0" />
                <span>Mon - Sat: 8:00 - 17:00</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} DAGIV Engineering Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <span className="text-slate-500 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-slate-500 hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="text-slate-500 hover:text-white transition-colors cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};