import React from 'react';
import { useTranslation } from 'react-i18next';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();

  return (
    <div className={`${i18n.language === 'th' ? 'font-sarabun' : 'font-inter'}`}>
      {children}
    </div>
  );
};
