import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Activity, Truck, Wrench, Search } from 'lucide-react';
import { CartDrawer } from '@/features/marketplace/CartDrawer';

interface NavbarProps {
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // --- TASK 1.2: Cart State ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Buy Equipment', path: '/marketplace' },
    { label: 'Plant Hire', path: '/rentals' },
    { label: 'Spare Parts', path: '/parts' },
    { label: 'Professionals', path: '/professionals' },
    { label: 'Consult', path: '/consult' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // --- TASK 1.2: Sync Cart Badge Count ---
  const fetchCartCount = async () => {
      const token = localStorage.getItem('dagiv_seller_token') || localStorage.getItem('dagiv_token');
      if (!token) return;
      try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/cart`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
              const data = await res.json();
              setCartCount(data.summary.item_count || 0);
          }
      } catch (e) {
          console.error("Cart count error", e);
      }
  };

  useEffect(() => {
      fetchCartCount();
      // Listen to the custom event triggered by ProductDetailOverlay and CartDrawer
      window.addEventListener('cartUpdated', fetchCartCount);
      return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center cursor-pointer group">
              <div className="h-10 w-10 bg-yellow-500 rounded flex items-center justify-center mr-3 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <Activity className="text-slate-900 h-6 w-6 font-bold" />
              </div>
              <div>
                <span className="text-white font-black text-xl tracking-tighter block group-hover:text-slate-200 transition-colors">DAGIV</span>
                <span className="text-yellow-500 text-xs font-bold tracking-widest block group-hover:text-yellow-400 transition-colors">ENGINEERING</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition-all ${
                      isActive(item.path)
                        ? 'text-yellow-500 bg-slate-900 shadow-inner border-b-2 border-yellow-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
               {/* TASK 1.2: CART ICON */}
               <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 text-slate-300 hover:text-yellow-500 transition-colors group"
                  aria-label="View Cart"
               >
                  <ShoppingCart size={22} className="group-hover:scale-110 transition-transform"/>
                  {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg border-2 border-slate-950 animate-in zoom-in">
                          {cartCount}
                      </span>
                  )}
               </button>

               <div className="h-6 w-px bg-slate-800 mx-2"></div>

               <Link 
                  to="/erp"
                  className="text-yellow-500 font-bold text-xs px-4 py-2 border border-yellow-500/30 rounded hover:bg-yellow-500/10 transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(234,179,8,0.1)] hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]"
               >
                  <Activity size={14} /> ERP LOGIN
               </Link>
               
               {/* Account / User Button */}
               <button 
                  onClick={onLoginClick} 
                  className="bg-slate-800 p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all"
                  title="Account Dashboard"
               >
                  <User size={18} />
               </button>
            </div>

            {/* Mobile Menu Buttons */}
            <div className="-mr-2 flex items-center md:hidden gap-4">
              <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-slate-300 hover:text-yellow-500"
              >
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-slate-950">
                          {cartCount}
                      </span>
                  )}
              </button>

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
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-bold w-full text-left flex items-center ${
                      isActive(item.path) 
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
                </Link>
              ))}
               <Link
                  to="/erp"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-900 bg-yellow-500 font-black uppercase tracking-wider block px-3 py-3 rounded-md text-base w-full text-center mt-4 shadow-lg hover:bg-yellow-400"
                >
                  ACCESS ERP DASHBOARD
                </Link>
                <button
                  onClick={() => { onLoginClick(); setIsOpen(false); }}
                  className="text-slate-300 bg-slate-800 font-bold uppercase tracking-wider block px-3 py-3 rounded-md text-base w-full text-center mt-2 border border-slate-700"
                >
                  ACCOUNT LOGIN
                </button>
            </div>
          </div>
        )}
      </nav>

      {/* RENDER THE DRAWER OUTSIDE THE NAV FLOW */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};