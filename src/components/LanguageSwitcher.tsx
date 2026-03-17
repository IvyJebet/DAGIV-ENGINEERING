import React, { useEffect, memo } from 'react';
import { Globe } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const LanguageSwitcherComponent = () => {
    useEffect(() => {
        let isMounted = true;
        let checkDropdown: ReturnType<typeof setInterval>;
        const PREF_KEY = 'dagiv_preferred_lang';

        // 1. RESTORE LANGUAGE
        const savedLang = localStorage.getItem(PREF_KEY);
        if (savedLang) {
            document.cookie = `googtrans=${savedLang}; path=/`;
            document.cookie = `googtrans=${savedLang}; path=/; domain=${window.location.hostname}`;
        }

        // 2. Define the initialization function
        window.googleTranslateElementInit = () => {
            if (!isMounted) return;
            
            const container = document.getElementById('dagiv_translate_element');
            if (container) {
                container.innerHTML = ''; 
                
                new window.google.translate.TranslateElement(
                    { 
                        pageLanguage: 'en',
                        autoDisplay: false,
                    },
                    'dagiv_translate_element'
                );

                // 3. BACKUP LANGUAGE listener
                checkDropdown = setInterval(() => {
                    const selectElement = document.querySelector('.goog-te-combo');
                    if (selectElement) {
                        clearInterval(checkDropdown);
                        
                        selectElement.addEventListener('change', () => {
                            setTimeout(() => {
                                const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
                                if (match && match[1]) {
                                    localStorage.setItem(PREF_KEY, match[1]);
                                } else {
                                    localStorage.removeItem(PREF_KEY);
                                }
                            }, 100);
                        });
                    }
                }, 500);
            }
        };

        // 4. The SPA "Nuclear Reset" 
        // We MUST do this so the widget survives React unmounting it during mobile resize
        const existingScript = document.getElementById('google-translate-script');
        if (existingScript) {
            existingScript.remove();
        }

        if (window.google && window.google.translate) {
            delete window.google.translate;
        }

        // 5. Inject a fresh script
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            isMounted = false;
            if (checkDropdown) clearInterval(checkDropdown);
        };
    }, []);

    return (
    <div className="relative z-50 pointer-events-auto flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 shadow-sm transition-colors hover:border-slate-700 w-auto max-w-full shrink-0">
        <Globe className="text-yellow-500 shrink-0" size={16} />
        <div 
            translate="no" 
            id="dagiv_translate_element" 
            className="flex items-center shrink-0 w-full max-w-[150px] overflow-hidden"
        ></div>
    </div>
);
};

export const LanguageSwitcher = memo(LanguageSwitcherComponent);