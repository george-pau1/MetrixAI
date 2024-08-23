
import React, { createContext, useState } from 'react';

// Create the context
export const FatContext = createContext();

// Create the provider component
export const FatProvider = ({ children }) => {
    const [fat, setFat] = useState(''); //Start the changes from here


  return (
    <FatContext.Provider value={{ fat, setFat }}>
      {children}
    </FatContext.Provider>
  );
};
