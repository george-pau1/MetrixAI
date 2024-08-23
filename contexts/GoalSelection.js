
import React, { createContext, useState } from 'react';

// Create the context
export const GoalContext = createContext();

// Create the provider component
export const GoalProvider = ({ children }) => {
    const [goal, setGoal] = useState(''); //Start the changes from here


  return (
    <GoalContext.Provider value={{ goal, setGoal  }}>
      {children}
    </GoalContext.Provider>
  );
};
