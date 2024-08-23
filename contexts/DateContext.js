//This is for the calendar function to show which date we are current showing
import React, { createContext, useState } from 'react';

// Create the context
export const DateContext = createContext();

// Create the provider component
export const DateProvider = ({ children }) => {
    const [date, setDateDay] = useState(''); //Start the changes from here
    const [timezone, setTimeZone] = useState('')


  return (
    <DateContext.Provider value={{ date, setDateDay, timezone, setTimeZone }}>
      {children}
    </DateContext.Provider>
  );
};
