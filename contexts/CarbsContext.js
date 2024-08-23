
import React, { createContext, useState } from 'react';

// Create the context
export const CarbsContext = createContext();

// Create the provider component
export const CarbsProvider = ({ children }) => {
    const [carbs, setCarbs] = useState(''); //Start the changes from here


  return (
    <CarbsContext.Provider value={{ carbs, setCarbs }}>
      {children}
    </CarbsContext.Provider>
  );
};
