
import React, { createContext, useState } from 'react';

// Create the context
export const ImpMetricContext = createContext();

// Create the provider component
export const ImpMetricProvider = ({ children }) => {
    const [impmetric, setImpMetric] = useState(''); //Start the changes from here


  return (
    <ImpMetricContext.Provider value={{ impmetric, setImpMetric  }}>
      {children}
    </ImpMetricContext.Provider>
  );
};
