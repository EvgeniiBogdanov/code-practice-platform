import React, { createContext, useContext } from "react";

export const PracticeContext = createContext(null);

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error("usePractice must be used within PracticeContext.Provider");
  }
  return context;
};
