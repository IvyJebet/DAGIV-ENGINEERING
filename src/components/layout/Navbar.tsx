import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, User, ShoppingCart, Activity, Truck, Wrench, 
  Search, ChevronDown, Package, LayoutDashboard,
  Home, Star, Camera
} from 'lucide-react';
import { CartDrawer } from '@/features/marketplace/CartDrawer';
import { useAuth } from '@/context/AuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const location = useLocation();
  
  // Notice: 'user' and 'token' now implicitly strictly equal BUYER thanks to AuthContext alias!
  const { user, token, logout, setShowAuthModal } = useAuth();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Services', path: '/services', icon: Wrench },
    { label: 'Gallery', path: '/gallery', icon: Camera },
  ];

  const marketDropdownItems = [
    { label: 'Buy Equipment', path: '/marketplace', icon: Package },
    { label: 'Lease Equipment', path: '/rentals', icon: Truck },
    { label: 'Spare Parts', path: '/parts', icon: Wrench },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isMarketActive = marketDropdownItems.some(item => location.pathname === item.path);

  const fetchCartCount = async () => {
      // 1. FIX: Uses explicit buyer token from the new AuthContext
      const currentToken = token; 
      if (!currentToken) {
          setCartCount(0);
          return;
      }
      try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/cart`, {
              headers: { 'Authorization': `Bearer ${currentToken}` }
          });
          if (res.ok) {
              const data = await res.json();
              setCartCount(data.summary?.item_count || 0);
          }
      } catch (e) {
          console.warn("Backend not reachable for cart count");
      }
  };

  useEffect(() => {
      fetchCartCount();
      window.addEventListener('cartUpdated', fetchCartCount);
      return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, [token]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        <div className="w-full max-w-[98%] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-24">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center cursor-pointer group shrink-0">
              <div className="h-17 w-32 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(234,179,8,0.4)] overflow-hidden">
                <img 
                   src="src/Assets/IMG-20260309-WA0000.jpg" 
                   alt="Dagiv Engineering Logo" 
                   className="h-full w-full object-cover" 
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-black text-2xl tracking-tighter block group-hover:text-slate-200 transition-colors">DAGIV</span>
                <span className="text-yellow-500 text-[10px] font-black tracking-[0.2em] block group-hover:text-yellow-400 transition-colors uppercase">Engineering</span>
              </div>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              
              {/* Home & Services Links */}
              {navItems.slice(0, 2).map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex flex-col items-center justify-center h-16 px-4 gap-1 group transition-all rounded-xl ${isActive(item.path) ? 'bg-slate-900 border-b-2 border-yellow-500' : 'hover:bg-slate-900/50'}`}
                >
                  <item.icon size={24} className={`transition-colors ${isActive(item.path) ? 'text-yellow-500' : 'text-slate-400 group-hover:text-yellow-400'}`} />
                  <span className={`text-xs font-black uppercase tracking-widest ${isActive(item.path) ? 'text-yellow-500' : 'text-slate-400 group-hover:text-slate-200'}`}>{item.label}</span>
                </Link>
              ))}

              {/* MARKETPLACE DROPDOWN */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsMarketOpen(true)}
                onMouseLeave={() => setIsMarketOpen(false)}
              >
                <button className={`flex flex-col items-center justify-center h-16 px-4 gap-1 rounded-xl transition-all group-hover:bg-slate-900/50 ${isMarketActive ? 'bg-slate-900 border-b-2 border-yellow-500' : ''}`}>
                    <ShoppingCart size={24} className={`transition-colors ${isMarketActive ? 'text-yellow-500' : 'text-slate-400 group-hover:text-yellow-400'}`}/>
                    <span className={`text-xs font-black uppercase tracking-widest transition-colors ${isMarketActive ? 'text-yellow-500' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        Marketplace <ChevronDown size={14} className={`inline-block transition-transform duration-300 ${isMarketOpen ? 'rotate-180' : ''}`}/>
                    </span>
                </button>
                {isMarketOpen && (
                  <div className="absolute top-full left-0 mt-1 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-[60] animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 gap-1">
                      {marketDropdownItems.map((item) => (
                        <Link 
                          key={item.label} 
                          to={item.path} 
                          onClick={() => setIsMarketOpen(false)}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-800 transition-all group/item"
                        >
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover/item:border-yellow-500/50 transition-colors">
                            <item.icon size={20} className="text-slate-400 group-hover/item:text-yellow-400 transition-colors"/>
                          </div>
                          <span className="text-[11px] font-black text-slate-300 group-hover/item:text-white uppercase tracking-widest">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Professionals, Consult */}
              {navItems.slice(2).map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex flex-col items-center justify-center h-16 px-4 gap-1 group transition-all rounded-xl ${isActive(item.path) ? 'bg-slate-900 border-b-2 border-yellow-500' : 'hover:bg-slate-900/50'}`}
                >
                  <item.icon size={24} className={`transition-colors ${isActive(item.path) ? 'text-yellow-500' : 'text-slate-400 group-hover:text-yellow-400'}`} />
                  <span className={`text-xs font-black uppercase tracking-widest ${isActive(item.path) ? 'text-yellow-500' : 'text-slate-400 group-hover:text-slate-200'}`}>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center space-x-3">
               
               {/* Cart */}
               <button onClick={() => setIsCartOpen(true)} className="relative flex flex-col items-center justify-center h-16 px-4 gap-1 text-slate-300 hover:text-yellow-500 transition-colors group rounded-xl hover:bg-slate-900/50">
                  <div className="relative">
                      <ShoppingCart size={24} className="text-slate-400 group-hover:text-yellow-400 group-hover:scale-110 transition-all"/>
                      {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full shadow-lg border-2 border-slate-950 animate-in zoom-in">
                              {cartCount}
                          </span>
                      )}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-200">Cart</span>
               </button>

               <div className="h-10 w-px bg-slate-800 mx-1"></div>

               {/* ERP Access */}
               <Link to="/erp" className="flex flex-col items-center justify-center h-16 px-4 gap-1 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-all group shadow-xl bg-slate-900/40">
                  <LayoutDashboard size={24} className="text-slate-400 group-hover:text-yellow-500 transition-colors" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-200">ERP Portal</span>
               </Link>
               
               {/* 2. FIX: USER ACCOUNT (STRICTLY BUYERS ONLY) */}
               {user && user.role !== 'SELLER' ? (
                   <div className="relative group">
                       <button className="flex flex-col items-center justify-center h-16 px-5 gap-1 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all font-bold">
                           <User size={24} className="text-yellow-500" />
                           <span className="text-xs font-black uppercase tracking-widest">Buyer Account</span>
                       </button>
                       <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden z-[70]">
                           <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/50 text-center">
                               <p className="text-[10px] text-yellow-500 uppercase font-black tracking-[0.2em] mb-1">Authenticated</p>
                               <p className="text-sm text-white font-bold truncate">{user.username}</p>
                           </div>
                           <Link to="/buyer/dashboard" className="px-5 py-4 text-sm text-slate-300 hover:bg-slate-800 hover:text-yellow-500 transition-colors flex items-center gap-3 font-bold">
                             <Package size={18} className="text-slate-400"/> Dashboard
                           </Link>
                           {/* 3. FIX: Only log out the BUYER */}
                           <button onClick={() => logout('BUYER')} className="px-5 py-4 text-sm text-left text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors border-t border-slate-800 font-bold">Log Out</button>
                       </div>
                   </div>
               ) : (
                   <button onClick={() => setShowAuthModal(true)} className="flex flex-col items-center justify-center h-16 px-6 gap-1 bg-yellow-500 rounded-xl text-slate-900 hover:bg-yellow-400 transition-all font-black text-[11px] uppercase tracking-widest shadow-lg shadow-yellow-500/20">
                       <User size={24} />
                       <span>Buyer Account</span>
                   </button>
               )}

               <div className="h-10 w-px bg-slate-800 mx-1"></div>

               {/* Language Switcher */}
               <LanguageSwitcher />

            </div>

            {/* Mobile Menu Toggle */}
            <div className="-mr-2 flex items-center lg:hidden gap-3">
              <LanguageSwitcher />
              
              <button onClick={() => setIsCartOpen(true)} className="relative text-slate-400 hover:text-white transition-colors p-2">
                 <ShoppingCart size={24} />
                 {cartCount > 0 && (
                     <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black h-4 w-4 flex items-center justify-center rounded-full shadow-lg border border-slate-950">
                         {cartCount}
                     </span>
                 )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-900 inline-flex items-center justify-center p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors ml-1"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 animate-in slide-in-from-top-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl text-base font-black uppercase tracking-widest transition-all ${isActive(item.path) ? 'text-yellow-500 bg-slate-900 border-l-4 border-yellow-500 shadow-inner' : 'text-slate-400'}`}
                >
                  <item.icon size={22} className={isActive(item.path) ? 'text-yellow-500' : 'text-slate-400'} />
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-slate-800 pt-4 mt-4">
                <p className="px-5 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Marketplace</p>
                <div className="grid grid-cols-1 gap-2">
                    {marketDropdownItems.map(item => (
                      <Link key={item.label} to={item.path} onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-8 py-3 rounded-xl text-sm font-black text-slate-400 hover:text-yellow-500 hover:bg-slate-900 transition-all uppercase tracking-widest group">
                        <item.icon size={20} className="text-slate-500 group-hover:text-yellow-400 transition-colors"/>
                        {item.label}
                      </Link>
                    ))}
                </div>
              </div>

               <Link to="/erp" onClick={() => setIsOpen(false)} className="text-yellow-500 font-black uppercase tracking-[0.2em] block px-5 py-5 rounded-xl text-center mt-6 border border-yellow-500/20 bg-yellow-500/5 shadow-inner">
                 <LayoutDashboard size={20} className="inline-block mr-2 mb-1"/> ERP PORTAL
               </Link>

               {/* 2. FIX: USER ACCOUNT (STRICTLY BUYERS ONLY) */}
               <div className="pt-6 border-t border-slate-800 mt-6 px-2">
                {user && user.role !== 'SELLER' ? (
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                      <div className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-3">Buyer Account</div>
                      <div className="flex flex-col gap-3">
                        <Link to="/buyer/dashboard" onClick={() => setIsOpen(false)} className="block py-3 px-4 bg-slate-950 rounded-lg text-slate-200 font-black uppercase tracking-widest text-xs border border-slate-800">Dashboard</Link>
                        {/* 3. FIX: Only log out the BUYER */}
                        <button onClick={() => { logout('BUYER'); setIsOpen(false); }} className="w-full text-center py-3 px-4 bg-red-950/30 text-red-400 font-black uppercase tracking-widest text-xs border border-red-900/20 rounded-lg">Sign Out</button>
                      </div>
                    </div>
                ) : (
                    <button onClick={() => { setShowAuthModal(true); setIsOpen(false); }} className="w-full text-center bg-yellow-500 text-slate-900 py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl">BUYER ACCOUNT</button>
                )}
               </div>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};