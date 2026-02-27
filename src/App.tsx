import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/features/auth/AuthModal';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Features & Pages
import HomePage from '@/pages/Home';
import CheckoutPage from '@/pages/Checkout';
import MarketplaceLayout from '@/pages/Marketplace';
import ServicesPage from '@/pages/Services';
import ProfessionalsPage from '@/pages/Professionals';
import ConsultPage from '@/pages/Consult';
import ContactPage from '@/pages/Contact';
import { InspectionBookingPage } from '@/pages/InspectionBooking';
import { BuyerDashboard } from '@/pages/BuyerDashboard';

// Feature Components
import { SellerDashboard } from '@/features/seller/SellerDashboard';
import { SellItemModal } from '@/features/seller/components/SellItemModal';
import { ERPDashboard } from '@/features/fleet/components/ERPDashboard';
import { OperatorPortal } from '@/features/fleet/components/OperatorPortal';

// Types
import { OperatorLog, PageView } from '@/types';

// Mock Data
const INITIAL_LOGS: OperatorLog[] = [
    {
        id: 'LOG-1002', machineId: 'e1', operatorName: 'John Kamau', date: '2023-10-25',
        startTime: '08:00', endTime: '16:30', startOdometer: 4500, endOdometer: 4508,
        fuelAddedLiters: 0, location: 'Nairobi Expressway Site',
        checklist: { tires: true, oil: true, hydraulics: true, brakes: true },
        notes: 'Routine operation. Hydraulic fluid top-up required soon.'
    },
    {
        id: 'LOG-1001', machineId: 'log1', operatorName: 'Samuel Ochieng', date: '2023-10-24',
        startTime: '07:30', endTime: '18:00', startOdometer: 12400, endOdometer: 12650,
        fuelAddedLiters: 150, location: 'Mombasa Road Transport',
        checklist: { tires: true, oil: true, hydraulics: true, brakes: false },
        notes: 'Brake pads worn out. Reported to maintenance.'
    }
];

const AppContent = () => {
  const { user, token, showAuthModal, setShowAuthModal, logout } = useAuth();
  const [erpAccess, setErpAccess] = useState(false);
  const [operatorLogs, setOperatorLogs] = useState<OperatorLog[]>(INITIAL_LOGS);
  const [showOperatorPortal, setShowOperatorPortal] = useState(false);
  const [inspectionMode, setInspectionMode] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpenOperator = () => setShowOperatorPortal(true);
    window.addEventListener('openOperatorPortal', handleOpenOperator);
    
    // 🛠️ FIX: Add listener for the Seller Portal
    const handleOpenSeller = () => setIsSelling(true);
    window.addEventListener('openSellerPortal', handleOpenSeller);
    
    return () => {
        window.removeEventListener('openOperatorPortal', handleOpenOperator);
        window.removeEventListener('openSellerPortal', handleOpenSeller);
    };
  }, []);

  const handleLogSubmit = (newLog: OperatorLog) => {
    setOperatorLogs([newLog, ...operatorLogs]);
  };

  const handleSellerLogin = (newToken: string) => {
    setIsSelling(false);
    navigate('/seller/dashboard');
  };

  const handleSellerLogout = () => {
    logout();
    navigate('/');
  };

const handleSellClick = () => {
    if (token && user?.role === 'SELLER') {
        navigate('/seller/dashboard');
    } else {
        setIsSelling(true);
    }
  };
  const setPageMock = (p: PageView) => {
      console.log("Legacy navigation requested:", p);
  }; 

  if (inspectionMode) {
      return (
          <InspectionBookingPage 
              onComplete={() => { setInspectionMode(false); navigate('/'); }} 
              onClose={() => setInspectionMode(false)} 
          />
      );
  }

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <HomePage setPage={setPageMock} onBookInspection={() => setInspectionMode(true)} onSellClick={handleSellClick} />
          } />
          <Route path="/marketplace" element={
            <MarketplaceLayout mode="BUY" setPage={setPageMock} onSellClick={handleSellClick} isSpareParts={false} />
          } />
          <Route path="/rentals" element={
            <MarketplaceLayout mode="RENT" setPage={setPageMock} onSellClick={handleSellClick} isSpareParts={false} />
          } />
          <Route path="/parts" element={
            <MarketplaceLayout mode="BUY" setPage={setPageMock} onSellClick={handleSellClick} isSpareParts={true} />
          } />
          <Route path="/services" element={<ServicesPage setPage={setPageMock} />} />
          <Route path="/erp" element={
            <ERPDashboard hasAccess={erpAccess} onSubscribe={() => setErpAccess(true)} logs={operatorLogs} />
          } />
          <Route path="/professionals" element={<ProfessionalsPage />} />
          <Route path="/consult" element={<ConsultPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/buyer/dashboard" element={
          token ? <BuyerDashboard /> : <Navigate to="/" />
        } />
        
        <Route path="/seller/dashboard" element={
          token && user?.role === 'SELLER' ? (
            <SellerDashboard token={token} onLogout={handleSellerLogout} setPage={setPageMock} />
          ) : (
            <Navigate to="/" />
          )
        } />
        
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>

      {showOperatorPortal && (
        <OperatorPortal onBack={() => setShowOperatorPortal(false)} onSubmit={handleLogSubmit} />
      )}

      {isSelling && (
          <SellItemModal onClose={() => setIsSelling(false)} onLoginSuccess={handleSellerLogin} />
      )}

      {showAuthModal && <AuthModal />}
    </>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;