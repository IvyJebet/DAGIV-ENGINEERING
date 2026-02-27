import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Activity, Truck, Wrench, Search, ClipboardCheck } from 'lucide-react';
import { CartDrawer } from '@/features/marketplace/CartDrawer';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, token, logout, setShowAuthModal } = useAuth();
  
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

  const fetchCartCount = async () => {
      // Use the global token from our new AuthContext if available, fallback to localStorage
      const currentToken = token || localStorage.getItem('dagiv_seller_token') || localStorage.getItem('dagiv_token');
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
  }, [token]); // Re-fetch if the user logs in/out

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
            
            {/* Desktop Navigation Links */}
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

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
               {/* Cart Icon */}
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

               {/* Operator Log Button */}
               <button 
                  onClick={() => window.dispatchEvent(new Event('openOperatorPortal'))}
                  className="text-slate-300 font-bold text-xs px-4 py-2 border border-slate-700 rounded hover:bg-slate-800 transition-colors flex items-center gap-2"
               >
                  <ClipboardCheck size={14} /> OPERATOR LOG
               </button>

               {/* ERP Login Button */}
               <Link 
                  to="/erp"
                  className="text-yellow-500 font-bold text-xs px-4 py-2 border border-yellow-500/30 rounded hover:bg-yellow-500/10 transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(234,179,8,0.1)] hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]"
               >
                  <Activity size={14} /> ERP LOGIN
               </Link>
               
               {/* User Account / Auth Dropdown */}
               {user ? (
                   <div className="relative group">
                       <button className="bg-slate-800 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-2 font-bold text-sm">
                           <User size={16} /> {user.username}
                       </button>
                       {/* Dropdown Menu */}
                       <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden">
                           <div className="px-4 py-3 border-b border-slate-800">
                               <p className="text-xs text-slate-500 uppercase font-bold">Signed in as</p>
                               <p className="text-sm text-white font-bold truncate">{user.username}</p>
                           </div>
                           <Link to="/buyer/dashboard" className="px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-yellow-500 transition-colors">Buyer Dashboard</Link>
                           {user.role === 'SELLER' && (
                               <Link to="/seller/dashboard" className="px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-yellow-500 transition-colors">Seller Dashboard</Link>
                           )}
                           <button onClick={logout} className="px-4 py-3 text-sm text-left text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors border-t border-slate-800">Log Out</button>
                       </div>
                   </div>
               ) : (
                   <button 
                       onClick={() => setShowAuthModal(true)} 
                       className="bg-slate-800 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-2 font-bold text-sm"
                   >
                       <User size={16} /> Login / Register
                   </button>
               )}
            </div>

            {/* Mobile Menu Toggle */}
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
                {user ? (
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="text-red-400 bg-slate-800 font-bold uppercase tracking-wider block px-3 py-3 rounded-md text-base w-full text-center mt-2 border border-slate-700"
                    >
                      LOG OUT
                    </button>
                ) : (
                    <button
                      onClick={() => { setShowAuthModal(true); setIsOpen(false); }}
                      className="text-slate-300 bg-slate-800 font-bold uppercase tracking-wider block px-3 py-3 rounded-md text-base w-full text-center mt-2 border border-slate-700"
                    >
                      LOGIN / REGISTER
                    </button>
                )}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};