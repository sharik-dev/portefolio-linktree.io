import React, { createContext, useContext, useState } from 'react';

type Lang = 'fr' | 'en';

interface LangContextValue {
    lang: Lang;
    toggleLang: () => void;
}

const LangContext = createContext<LangContextValue>({ lang: 'fr', toggleLang: () => { } });

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Lang>(() => {
        const stored = localStorage.getItem('lang') as Lang | null;
        if (stored === 'fr' || stored === 'en') return stored;
        return navigator.language.startsWith('en') ? 'en' : 'fr';
    });

    const toggleLang = () => {
        const next: Lang = lang === 'fr' ? 'en' : 'fr';
        localStorage.setItem('lang', next);
        setLang(next);
    };

    return (
        <LangContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LangContext.Provider>
    );
};

export const useLang = () => useContext(LangContext);

/* ─── Translation helper ─────────────────────────────────────────── */
export function t<T>(lang: Lang, fr: T, en: T): T {
    return lang === 'fr' ? fr : en;
}
