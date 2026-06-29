
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed top-0 w-full z-50 p-4 rounded shadow text-white ${
          toast.type === "error" ? "bg-red-600" : "bg-green-600"
        }`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
