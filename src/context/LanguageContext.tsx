import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import type { TranslationKey } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'world_blocs_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // 1. localStorage から取得
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ja' || saved === 'en') {
      return saved;
    }
    // 2. ブラウザ言語から判定
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en';
    }
    return 'ja';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage アクセス不可時は無視
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev: Language) => {
      const next: Language = prev === 'ja' ? 'en' : 'ja';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage アクセス不可時は無視
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = translations[language] || translations.ja;
      return dict[key] || translations.ja[key] || key;
    },
    [language]
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
