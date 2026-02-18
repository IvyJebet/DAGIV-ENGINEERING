import React, { useState } from 'react';
import { X, CheckCircle, FileText, RefreshCw, ArrowRight } from 'lucide-react';
import { ServiceDetail } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ServiceRequestModalProps {
  service: ServiceDetail;
  onClose: () => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ service, onClose }) => {
    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
    const [contactData, setContactData] = useState({ name: '', company: '', email: '', phone: '' });
    const [dynamicData, setDynamicData] = useState<Record<string, string>>({});

    const handleDynamicChange = (id: string, value: string) => {
        setDynamicData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('SENDING');
        try {
            const detailsString = service.requestFields?.map(field => 
                `${field.label}: ${dynamicData[field.id] || 'N/A'}`
            ).join('\n') || "No details provided.";

            const payload = {
                name: contactData.name,
                phone: contactData.phone,
                email: contactData.email,
                company: contactData.company || "N/A",
                serviceType: service.title,
                details: detailsString,
                duration: dynamicData['duration'] || undefined
            };
            const res = await fetch(`${API_URL}/api/service-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if(res.ok) setStatus('SUCCESS');
            else { alert("Server Error"); setStatus('IDLE'); }

        } catch (error) { console.error(error); alert("Connection Error"); setStatus('IDLE'); }
    };

    if (status === 'SUCCESS') {
        return (
            <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
                    {/* Fixed: Added accessible name */}
                    <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24}/></button>
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                        <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Request Received</h3>
                    <p className="text-slate-400 mb-6">Your inquiry for <span className="text-yellow-500">{service.title}</span> has been logged.</p>
                    <button onClick={onClose} className="bg-slate-800 text-white font-bold py-3 px-6 rounded-lg w-full border border-slate-700">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-start">
                    <div>
                        <div className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> Service Request
                        </div>
                        <h3 className="text-2xl font-black text-white leading-tight">{service.title}</h3>
                    </div>
                    {/* Fixed: Added accessible name */}
                    <button onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-white bg-slate-800/50 p-2 rounded-full"><X size={20}/></button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-slate-500 text-xs font-bold uppercase">Full Name</label>
                                {/* Fixed: Added accessible label */}
                                <input required aria-label="Full Name" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white"
                                    value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-slate-500 text-xs font-bold uppercase">Phone</label>
                                {/* Fixed: Added accessible label */}
                                <input required aria-label="Phone" type="tel" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white"
                                    value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-slate-500 text-xs font-bold uppercase">Email</label>
                            {/* Fixed: Added accessible label */}
                            <input required aria-label="Email" type="email" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white"
                                value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} />
                        </div>

                        <div className="bg-slate-800/20 p-6 rounded-xl border border-slate-700/50 space-y-4">
                            <h4 className="text-yellow-500 text-xs font-bold uppercase mb-2 flex items-center border-b border-slate-700/50 pb-2">
                                <FileText size={14} className="mr-2"/> Service Details
                            </h4>
                            {service.requestFields?.map((field) => (
                                <div key={field.id} className="space-y-1">
                                    <label className="block text-slate-400 text-xs font-bold uppercase">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {/* Fixed: Added accessible labels to dynamic inputs */}
                                    {field.type === 'textarea' ? (
                                        <textarea required={field.required} aria-label={field.label} className="w-full bg-slate-950 border border-slate-600 p-3 rounded-lg text-white h-24 text-sm"
                                            placeholder={field.placeholder} onChange={(e) => handleDynamicChange(field.id, e.target.value)} />
                                    ) : field.type === 'select' ? (
                                        <select aria-label={field.label} className="w-full bg-slate-950 border border-slate-600 p-3 rounded-lg text-white text-sm"
                                            onChange={(e) => handleDynamicChange(field.id, e.target.value)}>
                                            <option value="">Select Option...</option>
                                            {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                                        </select>
                                    ) : (
                                        <input type={field.type} required={field.required} aria-label={field.label} className="w-full bg-slate-950 border border-slate-600 p-3 rounded-lg text-white text-sm"
                                            placeholder={field.placeholder} onChange={(e) => handleDynamicChange(field.id, e.target.value)} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={status === 'SENDING'} className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded-lg hover:bg-yellow-400 shadow-lg flex items-center justify-center">
                                {status === 'SENDING' ? <RefreshCw className="animate-spin mr-2"/> : <span className="flex items-center">Submit Request <ArrowRight size={18} className="ml-2"/></span>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default ServiceRequestModal;