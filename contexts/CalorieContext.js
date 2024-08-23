
import React, { createContext, useState } from 'react';

// Create the context
export const CalorieContext = createContext();

// Create the provider component
export const CalorieProvider = ({ children }) => {
    const [calories, setCalories] = useState(''); //Start the changes from here


  return (
    <CalorieContext.Provider value={{ calories, setCalories }}>
      {children}
    </CalorieContext.Provider>
  );
};
