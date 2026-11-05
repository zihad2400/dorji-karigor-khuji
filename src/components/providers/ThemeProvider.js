'use client';
import { createContext, useContext, useEffect, useState } from 'react';

// কনটেক্সট তৈরি করা হলো ডিফল্ট ভ্যালু দিয়ে
const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // কনটেক্সট প্রোভাইডার রিটার্ন করা হলো
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// useTheme কাস্টম হুক তৈরি করা হলো
export const useTheme = () => {
  const context = useContext(ThemeContext);
  // যদি কোনোভাবে কনটেক্সট না পাওয়া যায়, তবে ডিফল্ট ভ্যালু রিটার্ন করবে
  if (!context) {
    return { theme: 'dark', toggleTheme: () => {} };
  }
  return context;
};
