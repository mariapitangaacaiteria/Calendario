'use client';

import React, {
  createContext, useState, useContext, ReactNode, useCallback, useRef, useEffect,
} from 'react';
import { ErrorIcon, SuccessIcon } from '@/components/icons/SnackIcons';
import { createPortal } from 'react-dom';

type Variant = 'success' | 'error';

interface SnackContextType {
  createSnack: (message: React.ReactNode, variant: Variant) => void;
}

const SnackContext = createContext<SnackContextType | undefined>(undefined);

export const useSnack = (): SnackContextType => {
  const ctx = useContext(SnackContext);
  if (!ctx) throw new Error('useSnack must be used within a SnackProvider');
  return ctx;
};

interface SnackProviderProps {
  children: ReactNode;
}

interface Snack {
  id: number;
  message: React.ReactNode;
  variant: Variant;
  visible: boolean;
}

export const SnackProvider: React.FC<SnackProviderProps> = ({ children }) => {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const createSnack = useCallback((message: React.ReactNode, variant: Variant) => {
    const id = Date.now();
    const newSnack: Snack = { id, message, variant, visible: true };

    // empilha (troque por [newSnack] se quiser apenas o último)
    setSnacks((prev) => [...prev, newSnack]);

    // animação de saída
    const hideId = window.setTimeout(() => {
      setSnacks((prev) => prev.map((s) => (s.id === id ? { ...s, visible: false } : s)));
    }, 2500);
    timeoutsRef.current.push(hideId);

    // remoção do DOM
    const removeId = window.setTimeout(() => {
      setSnacks((prev) => prev.filter((s) => s.id !== id));
    }, 3000);
    timeoutsRef.current.push(removeId);
  }, []);

  const snackMarkup = (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[9999] flex flex-col gap-2">
      {snacks.map((snack) => (
        <div
          key={snack.id}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className={`pointer-events-auto ${
            snack.visible ? 'opacity-100 translate-y-0' : 'translate-y-3 opacity-0'
          } flex items-center space-x-4 divide-x divide-slate-200 rounded-xl bg-white p-4 pr-5 text-slate-600 shadow transition-all duration-300 ease-out`}
        >
          {getVariantIcon(snack.variant)}
          <div className="max-w-md ps-4 font-normal">{snack.message}</div>
          {/* botão fechar opcional */}
          {/* <button onClick={() => setSnacks(prev => prev.filter(s => s.id !== snack.id))} className="ml-2 text-slate-400 hover:text-slate-600">✕</button> */}
        </div>
      ))}
    </div>
  );

  return (
    <SnackContext.Provider value={{ createSnack }}>
      {children}
      {/* portal para evitar clipping */}
      {typeof window !== 'undefined' ? createPortal(snackMarkup, document.body) : null}
    </SnackContext.Provider>
  );
};

const getVariantIcon = (variant: Variant) => {
  const base = 'h-7 w-7';
  switch (variant) {
    case 'success':
      return (
        <svg className={`${base} text-green-500`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd"/>
        </svg>
      );
    case 'error':
      return (
        <svg className={`${base} text-red-500`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clipRule="evenodd"/>
        </svg>
      );
    default:
      return null;
  }
};
