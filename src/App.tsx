import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

// Features & Pages
import HomePage from '@/pages/Home';
import CheckoutPage from '@/pages/Checkout';
import MarketplaceLayout from '@/pages/Marketplace';
import ServicesPage from '@/pages/Services';
import ProfessionalsPage from '@/pages/Professionals';
import ConsultPage from '@/pages/Consult';
import ContactPage from '@/pages/Contact';
import { InspectionBookingPage } from '@/pages/InspectionBooking';


// Feature Components
import { SellerDashboard } from '@/features/seller/SellerDashboard';
import { SellItemModal } from '@/features/seller/components/SellItemModal';
import { ERPDashboard } from '@/features/fleet/components/ERPDashboard';
import { OperatorPortal } from '@/features/fleet/components/OperatorPortal';

// Types
import { OperatorLog, PageView } from '@/types'; // Added PageView for compatibility

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
  const [erpAccess, setErpAccess] = useState(false);
  const [operatorLogs, setOperatorLogs] = useState<OperatorLog[]>(INITIAL_LOGS);
  const [showOperatorPortal, setShowOperatorPortal] = useState(false);
  const [inspectionMode, setInspectionMode] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [sellerToken, setSellerToken] = useState<string | null>(localStorage.getItem('dagiv_seller_token'));
  
  const navigate = useNavigate();

  const handleLogSubmit = (newLog: OperatorLog) => {
    setOperatorLogs([newLog, ...operatorLogs]);
  };

  const handleSellerLogin = (token: string) => {
    setSellerToken(token);
    localStorage.setItem('dagiv_seller_token', token);
    navigate('/seller/dashboard');
    setIsSelling(false);
  };

  const handleSellerLogout = () => {
    setSellerToken(null);
    localStorage.removeItem('dagiv_seller_token');
    navigate('/');
  };

  const handleSellClick = () => {
    if (sellerToken) {
        navigate('/seller/dashboard');
    } else {
        setIsSelling(true);
    }
  };

  // Mock function to satisfy legacy prop requirements until full refactor
  const setPageMock = (p: PageView) => {
      // Basic routing mapping for legacy components that might emit setPage
      console.log("Legacy navigation requested:", p);
  }; 

  // --- UPDATED: Inspection Mode with onClose ---
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
        <Route element={<MainLayout onLoginClick={() => setShowOperatorPortal(true)} />}>
          <Route path="/" element={
            <HomePage setPage={setPageMock} onBookInspection={() => setInspectionMode(true)} onSellClick={handleSellClick} />
          } />
          {/* UPDATED: Marketplace now receives real API logic via the Component itself */}
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

        <Route path="/seller/dashboard" element={
          sellerToken ? (
            <SellerDashboard token={sellerToken} onLogout={handleSellerLogout} setPage={setPageMock} />
          ) : (
            <Navigate to="/" />
          )
        } />
        
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>

      {/* Global Overlays */}
      {showOperatorPortal && (
        <OperatorPortal onBack={() => setShowOperatorPortal(false)} onSubmit={handleLogSubmit} />
      )}

      {isSelling && (
          <SellItemModal onClose={() => setIsSelling(false)} onLoginSuccess={handleSellerLogin} />
      )}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;