import React, { useState } from 'react';
import { SERVICES_CONTENT } from '@/config/constants';
import { ServiceDetail } from '@/types';
import { ServiceRequestModal } from '@/features/services/components/ServiceRequestModal';

export const ServicesPage = ({ setPage }: { setPage: any }) => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  
  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Our Engineering Services</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">From procurement to maintenance, we handle the entire lifecycle of your heavy machinery.</p>
            </div>
            
            <div className="space-y-20">
                {SERVICES_CONTENT.map((service, idx) => {
                    const Icon = service.icon;
                    return (
                        <div key={service.id} className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-stretch`}>
                            <div className="flex-1 relative min-h-[400px]">
                                <img src={service.image} alt={service.title} className="rounded-xl shadow-2xl border border-slate-800 w-full h-full object-cover absolute inset-0" />
                            </div>
                            <div className="flex-1 flex flex-col py-2">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-3xl font-bold text-white leading-tight mt-1">{service.title}</h3>
                                    <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-yellow-500 border border-slate-700 shadow-inner flex-shrink-0 ml-4">
                                        <Icon size={28} />
                                    </div>
                                </div>
                                <p className="text-slate-300 text-lg leading-relaxed mb-8">{service.fullDesc}</p>
                                <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 mb-8">
                                    <h4 className="text-yellow-500 font-bold uppercase text-xs mb-4 tracking-wider">Our Process</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {service.process.map((step, i) => (
                                            <div key={i} className="flex items-center text-slate-400 text-sm">
                                                <span className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold mr-3 border border-slate-700 text-slate-500">{i+1}</span>
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setSelectedService(service)} className="w-max px-8 py-3 bg-white text-slate-900 font-bold rounded hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_4px_0_0_rgba(15,23,42,1)] mt-auto md:mt-0">
                                    Request Service
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        {/* IMPORTANT: The modal is only rendered if selectedService is NOT null */}
        {selectedService && <ServiceRequestModal service={selectedService} onClose={() => setSelectedService(null)} />}
    </div>
  );
};

export default ServicesPage;