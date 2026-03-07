import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  // Legacy aliases (Defaults to Buyer to prevent breaking other files)
  user: User | null;
  token: string | null;
  
  // Explicit Dual Sessions
  buyer: User | null;
  buyerToken: string | null;
  seller: User | null;
  sellerToken: string | null;
  
  login: (token: string, user: User) => void;
  logout: (role?: 'BUYER' | 'SELLER' | 'ALL') => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // --- BUYER STATE (Independent) ---
  const [buyer, setBuyer] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('dagiv_buyer_user');
    if (storedUser) {
      try { return JSON.parse(storedUser); } 
      catch (e) { console.error("Failed to parse buyer", e); return null; }
    }
    return null;
  });
  const [buyerToken, setBuyerToken] = useState<string | null>(localStorage.getItem('dagiv_buyer_token'));

  // --- SELLER STATE (Independent) ---
  const [seller, setSeller] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('dagiv_seller_user');
    if (storedUser) {
      try { return JSON.parse(storedUser); } 
      catch (e) { console.error("Failed to parse seller", e); return null; }
    }
    return null;
  });
  const [sellerToken, setSellerToken] = useState<string | null>(localStorage.getItem('dagiv_seller_token'));

  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- RESTORED: Cross-tab synchronization for Dual Sessions ---
  useEffect(() => {
    const storedBuyer = localStorage.getItem('dagiv_buyer_user');
    if (storedBuyer && buyerToken && !buyer) {
      try { setBuyer(JSON.parse(storedBuyer)); } catch (e) { console.error(e); }
    }
    
    const storedSeller = localStorage.getItem('dagiv_seller_user');
    if (storedSeller && sellerToken && !seller) {
      try { setSeller(JSON.parse(storedSeller)); } catch (e) { console.error(e); }
    }
  }, [buyerToken, buyer, sellerToken, seller]);
 
  const login = (newToken: string, newUser: User) => {
    if (newUser.role === 'SELLER') {
      setSellerToken(newToken);
      setSeller(newUser);
      localStorage.setItem('dagiv_seller_token', newToken);
      localStorage.setItem('dagiv_seller_user', JSON.stringify(newUser));
    } else {
      setBuyerToken(newToken);
      setBuyer(newUser);
      localStorage.setItem('dagiv_buyer_token', newToken);
      localStorage.setItem('dagiv_buyer_user', JSON.stringify(newUser));
      localStorage.setItem('dagiv_token', newToken);
      localStorage.setItem('dagiv_user', JSON.stringify(newUser));
    }
    setShowAuthModal(false);
  };
  const logout = (role: 'BUYER' | 'SELLER' | 'ALL' = 'ALL') => {
    if (role === 'BUYER' || role === 'ALL') {
      setBuyerToken(null);
      setBuyer(null);
      localStorage.removeItem('dagiv_buyer_token');
      localStorage.removeItem('dagiv_buyer_user');
      localStorage.removeItem('dagiv_token');
      localStorage.removeItem('dagiv_user');
    }
    if (role === 'SELLER' || role === 'ALL') {
      setSellerToken(null);
      setSeller(null);
      localStorage.removeItem('dagiv_seller_token');
      localStorage.removeItem('dagiv_seller_user');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user: buyer,       // Backward compatibility alias (protects old files)
      token: buyerToken, // Backward compatibility alias (protects old files)
      buyer, 
      buyerToken, 
      seller, 
      sellerToken, 
      login, 
      logout, 
      showAuthModal, 
      setShowAuthModal 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};