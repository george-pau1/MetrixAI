
import React, { createContext, useState } from 'react';

// Create the context
export const GenderContext = createContext();

// Create the provider component
export const GenderProvider = ({ children }) => {
    const [gender, setGender] = useState(''); //Start the changes from here


  return (
    <GenderContext.Provider value={{ gender, setGender }}>
      {children}
    </GenderContext.Provider>
  );
};
