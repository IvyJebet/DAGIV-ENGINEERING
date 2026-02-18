import React, { useState } from 'react';
import { X, BadgeCheck, MapPin, Briefcase, Star, Shield, FileBarChart, Search, Info, Phone } from 'lucide-react';
import { ProfessionalProfile } from '@/types';
import { PROFESSIONALS } from '@/config/constants';

export const ProfessionalsPage = () => {
    const [filterRole, setFilterRole] = useState('All');
    const [selectedPro, setSelectedPro] = useState<ProfessionalProfile | null>(null);
    
    const roles = ['All', 'Civil Engineer', 'Structural Engineer', 'Mechanical Engineer', 'Software Engineer', 'Welder', 'Mechanic', 'Operator', 'Driver'];
    const filteredPros = filterRole === 'All' ? PROFESSIONALS : PROFESSIONALS.filter(p => p.role === filterRole);

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-4xl font-bold text-white mb-2">Professionals Hub</h2>
                        <p className="text-slate-400 text-sm">Hire verified engineers, operators, and fabricators.</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center md:justify-end">
                        {roles.map(r => (
                            <button key={r} onClick={() => setFilterRole(r)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filterRole === r ? 'bg-yellow-500 text-slate-900 transform scale-105 shadow-lg' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-yellow-500'}`}>
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredPros.map(prof => (
                    <div key={prof.id} className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-center hover:border-yellow-500/50 transition-all group hover:-translate-y-1 relative overflow-hidden shadow-lg">
                        {prof.verified && (
                            <div className="absolute top-3 right-3 text-blue-500 bg-slate-900 rounded-full p-1 border border-slate-800 shadow-sm" title="Verified Professional"><BadgeCheck size={20} /></div>
                        )}
                        <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl overflow-hidden relative border-2 border-slate-700 group-hover:border-yellow-500 transition-colors">
                            {prof.image ? <img src={prof.image} alt={prof.name} className="w-full h-full object-cover" /> : <span className="text-slate-500 font-bold">{prof.name.charAt(0)}</span>}
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight">{prof.name}</h3>
                        <p className="text-yellow-500 text-xs font-bold uppercase mb-1 mt-1">{prof.role}</p>
                        <p className="text-slate-500 text-xs mb-3">{prof.specialization}</p>
                        <div className="flex justify-center gap-1 mb-4 text-yellow-500">
                            {[...Array(5)].map((_,i) => <Star key={i} size={14} fill={i < Math.floor(prof.rating) ? "currentColor" : "none"} />)}
                            <span className="text-slate-600 text-xs ml-1">({prof.reviews?.length || 0})</span>
                        </div>
                        <div className="border-t border-slate-800 pt-4 mt-4">
                            <button onClick={() => setSelectedPro(prof)} className="w-full bg-slate-800 text-white py-2 rounded text-sm hover:bg-white hover:text-slate-900 font-bold transition-colors border border-slate-700">View Profile & Portfolio</button>
                        </div>
                    </div>
                    ))}
                </div>
                {filteredPros.length === 0 && <div className="text-center py-20"><p className="text-slate-500">No professionals found for this category yet.</p></div>}
            </div>

            {/* Modal */}
            {selectedPro && (
                <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
                    <div className="bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]">
                        
                        {/* Fixed: Added aria-label for accessibility */}
                        <button onClick={() => setSelectedPro(null)} aria-label="Close profile details" className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors"><X size={20}/></button>
                        
                        <div className="h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative border-b border-slate-800">
                            <div className="absolute -bottom-12 left-8">
                                <div className="w-24 h-24 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800">
                                    {/* Fixed: Added alt text */}
                                    {selectedPro.image ? <img src={selectedPro.image} alt={selectedPro.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-2xl">{selectedPro.name.charAt(0)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="pt-16 px-8 pb-8 overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-white flex items-center">{selectedPro.name}</h2>
                                    <p className="text-yellow-500 font-bold uppercase text-sm tracking-wider flex items-center gap-2 mt-1">{selectedPro.role} <span className="text-slate-600">•</span> {selectedPro.specialization}</p>
                                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                                        <span className="flex items-center"><MapPin size={14} className="mr-1"/> {selectedPro.location}</span>
                                        <span className="flex items-center"><Briefcase size={14} className="mr-1"/> {selectedPro.yearsExperience} Years Exp.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <div className="md:col-span-2">
                                    <h3 className="text-white font-bold mb-3 border-b border-slate-800 pb-2">About</h3>
                                    <p className="text-slate-300 leading-relaxed text-sm">{selectedPro.bio}</p>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-3 border-b border-slate-800 pb-2">Certifications</h3>
                                    <div className="flex flex-wrap gap-2">{selectedPro.certifications?.map((cert, i) => <span key={i} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded flex items-center"><Shield size={10} className="mr-1 text-green-500"/> {cert}</span>)}</div>
                                </div>
                            </div>
                            <div className="sticky bottom-0 pt-6 mt-6 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-xs text-slate-500"><Info size={12} className="inline mr-1 text-yellow-500"/> For security, all bookings are handled via the DAGIV Central Admin.</p>
                                <a href="tel:+254704385809" className="w-full md:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded transition-colors shadow-lg flex items-center justify-center"><Phone size={18} className="mr-2"/> Call Admin to Book</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalsPage;