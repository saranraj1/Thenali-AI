"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

import { translations, type Language } from '../locales/translations';
export type { Language };
interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}


const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>("English");

    useEffect(() => {
        const storedLang = localStorage.getItem("bharat_ai_lang") as Language;
        if (storedLang && translations[storedLang]) {
            setLanguageState(storedLang);
            updateBodyClass(storedLang);
        } else {
            updateBodyClass("English");
        }
    }, []);

    const updateBodyClass = (lang: string) => {
        if (typeof document === 'undefined') return;
        // Remove all previous language classes
        const classes = Array.from(document.body.classList).filter(c => c.startsWith('lang-'));
        classes.forEach(c => document.body.classList.remove(c));

        // Add new language class
        document.body.classList.add(`lang-${lang.toLowerCase()}`);
    };

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("bharat_ai_lang", lang);
        updateBodyClass(lang);
    }, []);

    const t = useCallback((key: string) => {
        const langSource = translations[language] || translations["English"];
        return langSource[key] || translations["English"][key] || key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
