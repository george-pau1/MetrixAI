
import React, { createContext, useState } from 'react';

// Create the context
export const WorkoutContext = createContext();

// Create the provider component
export const WorkoutProvider = ({ children }) => {
    const [workout, setWorkout] = useState(''); //Start the changes from here


  return (
    <WorkoutContext.Provider value={{ workout, setWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};
