import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface MainLayoutProps {
  onLoginClick: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ onLoginClick }) => {
  return (
    <div className="bg-slate-950 min-h-screen flex flex-col font-sans text-slate-200 selection:bg-yellow-500 selection:text-slate-900">
      <Navbar onLoginClick={onLoginClick} />
      
      <main className="flex-1">
        {/* Outlet renders the child route's element (e.g. HomePage, MarketplacePage) */}
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};