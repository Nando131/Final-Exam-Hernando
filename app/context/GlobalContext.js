'use client';
import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <GlobalContext.Provider value={{ isDarkMode, toggleTheme, selectedCategory, setSelectedCategory }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);