'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TRANSLATIONS, getTranslation } from '@/lib/translations';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key) => TRANSLATIONS['en'][key] || key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anurag_lang') as Language;
      if (saved === 'kn' || saved === 'en') {
        setLang(saved);
      }
    }
  }, []);

  const toggleLanguage = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'kn' : 'en';
      if (typeof window !== 'undefined') {
        localStorage.setItem('anurag_lang', next);
      }
      return next;
    });
  };

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('anurag_lang', newLang);
    }
  };

  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    return getTranslation(lang, key);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
