
import React, { createContext, useState } from 'react';

// Create the context
export const ProteinContext = createContext();

// Create the provider component
export const ProteinProvider = ({ children }) => {
    const [protein, setProtein] = useState(''); //Start the changes from here


  return (
    <ProteinContext.Provider value={{ protein, setProtein }}>
      {children}
    </ProteinContext.Provider>
  );
};
