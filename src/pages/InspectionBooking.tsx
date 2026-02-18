import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface InspectionBookingProps {
  onComplete: () => void;
  onClose: () => void; // Added prop
}

export const InspectionBookingPage: React.FC<InspectionBookingProps> = ({ onComplete, onClose }) => {
    const [step, setStep] = useState(1);
    
    const [bookingData, setBookingData] = useState({
        machineType: 'Excavator', location: '', contactPerson: '', phone: '', date: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setBookingData({...bookingData, [e.target.name]: e.target.value});
    };

    const canProceedToStep2 = () => bookingData.location.length > 2;
    const canSubmit = () => bookingData.contactPerson.length > 2 && bookingData.phone.length > 9 && bookingData.date !== '';

    const submitBooking = async () => {
        if (!canSubmit()) { alert("Please fill in all contact details and date."); return; }
        try {
            const response = await fetch(`${API_URL}/api/book-inspection`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            if (response.ok) setStep(3); 
            else alert("Failed to book inspection. Please try again.");
        } catch (error) { console.error("Error:", error); alert("Server error. Is the backend running?"); }
    };
    
    return (
        <div className="fixed inset-0 z-[90] min-h-screen bg-slate-950/95 backdrop-blur-sm py-16 px-4 overflow-y-auto">
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl mt-10 relative">
                
                {/* NEW: Close Button with Accessibility Fix */}
                <button 
                    onClick={onClose} 
                    aria-label="Close"
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-slate-800 rounded-full text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="bg-yellow-500 p-6">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center pr-8"><Search className="mr-3"/> BOOK INSPECTION</h2>
                    <p className="text-slate-900/80 font-medium">Schedule a certified engineer to inspect your machinery.</p>
                </div>
                
                {/* Steps Header */}
                <div className="flex border-b border-slate-800">
                    <div className={`flex-1 py-3 text-center text-sm font-bold ${step >= 1 ? 'text-yellow-500 bg-slate-800' : 'text-slate-600'}`}>1. Machine</div>
                    <div className={`flex-1 py-3 text-center text-sm font-bold ${step >= 2 ? 'text-yellow-500 bg-slate-800' : 'text-slate-600'}`}>2. Contact</div>
                    <div className={`flex-1 py-3 text-center text-sm font-bold ${step >= 3 ? 'text-yellow-500 bg-slate-800' : 'text-slate-600'}`}>3. Confirm</div>
                </div>
                
                {/* Step 1 Content */}
                {step === 1 && (
                    <div className="p-8 space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Step 1: Machine Details</h3>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Machine Type</label>
                            <select 
                                name="machineType" 
                                value={bookingData.machineType} 
                                onChange={handleChange} 
                                aria-label="Machine Type"
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-4"
                            >
                                <option>Excavator</option><option>Truck</option><option>Generator</option><option>Backhoe Loader</option><option>Grader</option><option>Other</option>
                            </select>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Location of Machine</label>
                            <input 
                                name="location" 
                                value={bookingData.location} 
                                onChange={handleChange} 
                                type="text" 
                                aria-label="Location of Machine"
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" 
                                placeholder="e.g. Athi River Site" 
                            />
                        </div>
                        <button onClick={() => { if (canProceedToStep2()) setStep(2); else alert("Please enter the machine location."); }} className={`w-full font-bold py-3 rounded transition-colors ${canProceedToStep2() ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>Next Step</button>
                    </div>
                )}

                {/* Step 2 Content */}
                {step === 2 && (
                    <div className="p-8 space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Step 2: Contact Info</h3>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Contact Person</label>
                            <input 
                                name="contactPerson" 
                                value={bookingData.contactPerson} 
                                onChange={handleChange} 
                                type="text" 
                                aria-label="Contact Person"
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-4" 
                                placeholder="Full Name" 
                            />
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Phone Number</label>
                            <input 
                                name="phone" 
                                value={bookingData.phone} 
                                onChange={handleChange} 
                                type="text" 
                                aria-label="Phone Number"
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-4" 
                                placeholder="0700 000 000" 
                            />
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Preferred Date</label>
                            <input 
                                name="date" 
                                value={bookingData.date} 
                                onChange={handleChange} 
                                type="date" 
                                aria-label="Preferred Date"
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" 
                            />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 bg-slate-800 text-white font-bold py-3 rounded hover:bg-slate-700">Back</button>
                            <button onClick={submitBooking} className={`flex-1 font-bold py-3 rounded transition-colors ${canSubmit() ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>Book Now</button>
                        </div>
                    </div>
                )}

                {/* Step 3 Content */}
                {step === 3 && (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6 text-white"><Check size={40}/></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Inspection Booked!</h3>
                        <p className="text-slate-400 mb-6">Order #INSP-{Math.floor(Math.random()*1000)}. Status: <span className="text-yellow-500 font-bold">PENDING</span>.<br/>Our team will confirm availability within 2 hours.</p>
                        <button onClick={onComplete} className="bg-slate-800 text-white px-8 py-3 rounded font-bold hover:bg-slate-700">Return Home</button>
                    </div>
                )}
            </div>
        </div>
    );
};