import React, { useState } from 'react';
import { CheckCircle, Phone } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const ConsultPage = () => {
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS'>('IDLE');
  const [humanForm, setHumanForm] = useState({
      name: '', phone: '', type: 'General Technical Advice (Free)', details: ''
  });

  const handleHumanSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus('SUBMITTING');
      try {
          const res = await fetch(`${API_URL}/api/consultation`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(humanForm)
          });
          if (res.ok) setFormStatus('SUCCESS');
          else { alert("Failed to submit request."); setFormStatus('IDLE'); }
      } catch (e) { console.error(e); alert("Error sending request."); setFormStatus('IDLE'); }
  };

  return (
     <div className="min-h-screen bg-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">Engineering Consultation</h2>
                <p className="text-slate-400">Schedule a session with a certified professional engineer.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl animate-in fade-in">
                {formStatus === 'SUCCESS' ? (
                    <div className="text-center py-10">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                        <p className="text-slate-400">Your request has been logged. Ticket #CN-921.<br/>An engineer will contact you shortly via WhatsApp.</p>
                        <button onClick={() => setFormStatus('IDLE')} className="mt-6 text-yellow-500 underline">Submit another request</button>
                    </div>
                ) : (
                    <form onSubmit={handleHumanSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="consult-name" className="block text-slate-500 text-xs font-bold uppercase mb-2">Your Name</label>
                                <input id="consult-name" type="text" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" required value={humanForm.name} onChange={(e) => setHumanForm({...humanForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label htmlFor="consult-phone" className="block text-slate-500 text-xs font-bold uppercase mb-2">Phone</label>
                                <input id="consult-phone" type="text" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="+254..." required value={humanForm.phone} onChange={(e) => setHumanForm({...humanForm, phone: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="consult-type" className="block text-slate-500 text-xs font-bold uppercase mb-2">Consultation Type</label>
                            <select id="consult-type" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={humanForm.type} onChange={(e) => setHumanForm({...humanForm, type: e.target.value})}>
                                <option>General Technical Advice (Free)</option>
                                <option>Site Inspection Request (Paid)</option>
                                <option>Machine Valuation (Paid)</option>
                                <option>Project Feasibility Study (Paid)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="consult-details" className="block text-slate-500 text-xs font-bold uppercase mb-2">Details</label>
                            <textarea id="consult-details" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white h-32" required value={humanForm.details} onChange={(e) => setHumanForm({...humanForm, details: e.target.value})}></textarea>
                        </div>
                        <button type="submit" disabled={formStatus === 'SUBMITTING'} className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded hover:bg-yellow-400 transition-colors">{formStatus === 'SUBMITTING' ? 'Scheduling...' : 'SCHEDULE CONSULTATION'}</button>
                    </form>
                )}
            </div>
        </div>
     </div>
  );
};
export default ConsultPage;