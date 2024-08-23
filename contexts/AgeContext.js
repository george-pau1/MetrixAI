
import React, { createContext, useState } from 'react';

// Create the context
export const AgeContext = createContext();

// Create the provider component
export const AgeProvider = ({ children }) => {
    const [age, setAge] = useState(''); //Start the changes from here


  return (
    <AgeContext.Provider value={{ age, setAge }}>
      {children}
    </AgeContext.Provider>
  );
};
