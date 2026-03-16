import { Check, X } from 'lucide-react';
import { useEffect } from 'react';

type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? Check : X;

  return (
    <div className={`fixed bottom-4 right-4 left-4 sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-sm border rounded-lg p-3 sm:p-4 ${bgColor} ${textColor} flex items-center gap-2 sm:gap-3 shadow-lg animate-slide-in`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
      <p className="text-xs sm:text-sm font-medium flex-1 sm:flex-none">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto text-lg leading-none opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
}
