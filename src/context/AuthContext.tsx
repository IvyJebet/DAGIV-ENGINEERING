import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('dagiv_token'));
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('dagiv_user');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('dagiv_token', newToken);
    localStorage.setItem('dagiv_user', JSON.stringify(newUser));
    // Keep backwards compatibility for existing seller routes
    if (newUser.role === 'SELLER') {
        localStorage.setItem('dagiv_seller_token', newToken);
    }
    setShowAuthModal(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dagiv_token');
    localStorage.removeItem('dagiv_user');
    localStorage.removeItem('dagiv_seller_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, showAuthModal, setShowAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};