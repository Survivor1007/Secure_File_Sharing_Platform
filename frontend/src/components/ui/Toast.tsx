import React, { useDebugValue, useEffect } from "react";

interface ToastProps{
      message: string;
      type: 'success' | 'error';
      onClose: () => void;
}

const Toast = ({message, type, onClose}: ToastProps) => {
      useEffect(() => {
            const timer = setTimeout(onClose, 4000);
            return () => {clearTimeout(timer)};
      });

      return(
            <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium ${type === "success"? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                  {type === "success"? '✅' : '⚠️'}{message}
            </div>
      );
};

export default Toast;
