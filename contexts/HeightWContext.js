
import React, { createContext, useState } from 'react';

// Create the context
export const HeightWContext = createContext();

// Create the provider component
export const HeightWProvider = ({ children }) => {
    const [heightW, setHeightW] = useState(''); //Start the changes from here


  return (
    <HeightWContext.Provider value={{ heightW, setHeightW }}>
      {children}
    </HeightWContext.Provider>
  );
};
