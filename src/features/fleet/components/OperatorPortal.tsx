import React, { useState } from 'react';
import { X, ClipboardCheck, Activity, ShieldCheck, FileBadge, RefreshCw } from 'lucide-react';
import { OperatorLog } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface OperatorPortalProps {
  onBack: () => void;
  onSubmit: (log: OperatorLog) => void;
}

export const OperatorPortal: React.FC<OperatorPortalProps> = ({ onBack, onSubmit }) => {
    // Stage 1: Auth, Stage 2: Log Entry
    const [authStep, setAuthStep] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [token, setToken] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        machineId: '',
        startTime: '', 
        endTime: '',   
        currentReading: '', 
        readingUnit: 'Kilometers (km)', 
        fuel: '',
        location: '',
        notes: '',
        checklist: { tires: false, oil: false, hydraulics: false, brakes: false }
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    identifier: credentials.username, 
                    password: credentials.password 
                })
            });
            const data = await response.json();
            if (response.ok) { setToken(data.access_token); setAuthStep(false); } 
            else { alert(data.detail || "Login failed."); }
        } catch (error) { alert("Connection error."); } 
        finally { setIsLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.startTime || !formData.endTime) { alert("Please enter start and end times."); return; }
        
        const payload = {
            id: `LOG-${Date.now()}`,
            machineId: formData.machineId,
            operatorName: credentials.username, 
            date: new Date().toISOString().split('T')[0],
            startTime: formData.startTime, 
            endTime: formData.endTime,
            startOdometer: parseFloat(formData.currentReading) || 0, 
            endOdometer: 0, 
            fuelAddedLiters: parseFloat(formData.fuel) || 0,
            location: formData.location,
            checklist: formData.checklist,
            notes: `${formData.notes} [UNIT:${formData.readingUnit}]` 
        };

        try {
            const response = await fetch(`${API_URL}/api/operator-logs`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) { 
                onSubmit(payload as any); 
                onBack(); 
                alert("Log Submitted Successfully!");
            } 
            else { 
                const errData = await response.json();
                alert(`Failed to submit: ${errData.detail || "Unknown error"}`); 
            }
        } catch (error) { 
            console.error(error);
            alert("Network error."); 
        }
    };
    const toggleCheck = (key: keyof typeof formData.checklist) => {
        setFormData(prev => ({ ...prev, checklist: { ...prev.checklist, [key]: !prev.checklist[key] } }));
    };

    if (authStep) {
        return (
            <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl relative">
                    <button 
                        onClick={onBack} 
                        aria-label="Close" // Added aria-label
                        className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Operator Login</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Added aria-labels for inputs missing visual labels */}
                        <input aria-label="Username" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Username" onChange={e=>setCredentials({...credentials, username: e.target.value})}/>
                        <input aria-label="Password" type="password" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Password" onChange={e=>setCredentials({...credentials, password: e.target.value})}/>
                        <button disabled={isLoading} className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded hover:bg-yellow-400 transition-colors">
                            {isLoading ? <RefreshCw className="animate-spin mx-auto"/> : "Login"}
                        </button>
                    </form>
                    <button onClick={onBack} className="w-full text-center text-slate-500 mt-4 hover:text-white text-sm">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] relative">
                
                {/* Header (Stays Fixed) */}
                <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center"><ClipboardCheck className="mr-2 text-yellow-500"/> Daily Log</h2>
                    <button 
                        onClick={onBack} 
                        aria-label="Close form" // Added aria-label
                        className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
                    >
                        <X size={24}/>
                    </button>
                </div>
                
                {/* Scrollable Form Body */}
                <div className="overflow-y-auto p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                {/* Linked label to input with htmlFor and id */}
                                <label htmlFor="machineId" className="text-slate-500 text-xs font-bold uppercase mb-2 block">Machine ID / Plate</label>
                                <input id="machineId" required className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500" 
                                    placeholder="e.g. KCD 892J" value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} />
                            </div>
                            <div>
                                <label htmlFor="location" className="text-slate-500 text-xs font-bold uppercase mb-2 block">Site Location</label>
                                <input id="location" required className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500" 
                                    placeholder="e.g. Athi River" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                            </div>
                        </div>

                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                            <h3 className="text-white font-bold text-sm mb-4 flex items-center"><Activity size={16} className="mr-2 text-blue-500"/> Time & Meter Reading</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="startTime" className="text-slate-500 text-xs mb-1 block">Start Time</label>
                                    <input id="startTime" required type="time" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" 
                                        value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="endTime" className="text-slate-500 text-xs mb-1 block">End Time</label>
                                    <input id="endTime" required type="time" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" 
                                        value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="currentReading" className="text-slate-500 text-xs mb-1 block">Current Meter Reading</label>
                                    <input id="currentReading" required type="number" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-bold" 
                                        placeholder="e.g. 12500" value={formData.currentReading} onChange={e => setFormData({...formData, currentReading: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="readingUnit" className="text-slate-500 text-xs mb-1 block">Reading Unit</label>
                                    <select id="readingUnit" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white"
                                        value={formData.readingUnit} onChange={e => setFormData({...formData, readingUnit: e.target.value})}>
                                        <option value="km">Kilometers (km)</option>
                                        <option value="mi">Miles (mi)</option>
                                        <option value="hrs">Engine Hours (hrs)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="fuel" className="text-slate-500 text-xs mb-1 block">Fuel Added (L)</label>
                                    <input id="fuel" type="number" className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" 
                                        value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-sm mb-4 flex items-center"><ShieldCheck size={16} className="mr-2 text-green-500"/> Pre-Start Safety Check</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Tires/Tracks', 'Engine Oil', 'Hydraulics', 'Brakes'].map((label, i) => {
                                    const key = Object.keys(formData.checklist)[i] as keyof typeof formData.checklist;
                                    return (
                                        <button key={key} type="button" onClick={() => toggleCheck(key)}
                                            className={`p-3 rounded border flex flex-col items-center justify-center transition-all ${formData.checklist[key] ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-slate-950 border-slate-700 text-slate-500'}`}>
                                            <span className="text-xs font-bold">{label}</span>
                                            <div className={`w-3 h-3 rounded-full mt-2 ${formData.checklist[key] ? 'bg-green-500' : 'bg-slate-800'}`}></div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="notes" className="text-slate-500 text-xs font-bold uppercase mb-2 block">Operational Notes</label>
                            <textarea id="notes" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white h-20 text-sm" 
                                placeholder="Issues, delays, or maintenance requests..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                        </div>

                        {/* Submit Button Section */}
                        <div className="pt-4 border-t border-slate-800 pb-2">
                            <button type="submit" className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded hover:bg-yellow-400 shadow-lg flex items-center justify-center">
                                <FileBadge className="mr-2" size={20}/> Submit Daily Log
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};