// "use client"; // must for hooks

// import { createContext, useContext, useState } from "react";

// // 1. Create Context
// const PantryModalContext = createContext();

// // 2. Provider component
// export function PantryModalProvider({ children }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <PantryModalContext.Provider value={{ open, setOpen }}>
//       {children}
//     </PantryModalContext.Provider>
//   );
// }

// // 3. Custom hook to use context easily
// export const usePantryModal = () => useContext(PantryModalContext);

"use client";
import { createContext, useContext, useState } from "react";

const PantryModalContext = createContext(null);

export const PantryModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <PantryModalContext.Provider value={{ open, setOpen }}>
      {children}
    </PantryModalContext.Provider>
  );
};

export const usePantryModal = () => {
  return useContext(PantryModalContext);
};