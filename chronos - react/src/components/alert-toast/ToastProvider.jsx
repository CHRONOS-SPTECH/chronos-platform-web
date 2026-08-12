import React, { createContext, useContext, useState, useCallback } from "react";
import Alert from "./AlertToast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ type: null, message: null });

  const show = useCallback((type, message, timeout = 4000) => {
    setToast({ type, message });
    if (timeout > 0) {
      setTimeout(() => setToast({ type: null, message: null }), timeout);
    }
  }, []);

  const clear = useCallback(() => setToast({ type: null, message: null }), []);

  const api = {
    success: (msg, t) => show("success", msg, t),
    error: (msg, t) => show("error", msg, t),
    info: (msg, t) => show("success", msg, t),
    clear,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Alert type={toast.type} message={toast.message} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default ToastProvider;
