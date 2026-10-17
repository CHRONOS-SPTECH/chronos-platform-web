import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Alert from "./AlertToast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ type: null, message: null });
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback(
    (type, message, timeout = 4000) => {
      clearTimer();
      setToast({ type, message });

      if (timeout > 0) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          setToast({ type: null, message: null });
        }, timeout);
      }
    },
    [clearTimer],
  );

  const clear = useCallback(() => {
    clearTimer();
    setToast({ type: null, message: null });
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  const api = useMemo(
    () => ({
      success: (msg, timeout) => show("success", msg, timeout),
      error: (msg, timeout) => show("error", msg, timeout),
      info: (msg, timeout) => show("info", msg, timeout),
      warning: (msg, timeout) => show("warning", msg, timeout),
      clear,
    }),
    [clear, show],
  );

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
