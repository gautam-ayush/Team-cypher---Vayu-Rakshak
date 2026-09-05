import { createContext, useContext, useState, useCallback } from 'react';

const CursorContext = createContext(null);

export function CursorProvider({ children }) {
  const [cursorType, setCursorType] = useState('default');

  const setCursor = useCallback((type) => {
    setCursorType(type);
  }, []);

  return (
    <CursorContext.Provider value={{ cursorType, setCursor }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error('useCursor must be used within CursorProvider');
  return ctx;
}
