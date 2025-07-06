'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Font = 'pixel' | 'readable';

interface FontContextType {
  font: Font;
  toggleFont: () => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: ReactNode }) {
  const [font, setFont] = useState<Font>('pixel');

  useEffect(() => {
    const savedFont = localStorage.getItem('font-theme') as Font | null;
    if (savedFont) {
      setFont(savedFont);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (font === 'readable') {
      root.classList.add('font-readable');
    } else {
      root.classList.remove('font-readable');
    }
    localStorage.setItem('font-theme', font);
  }, [font]);

  const toggleFont = () => {
    setFont(prevFont => (prevFont === 'pixel' ? 'readable' : 'pixel'));
  };

  return (
    <FontContext.Provider value={{ font, toggleFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}
