import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ToastType } from '@/components/Toast';

// Toast Item Interface
interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onPress?: () => void;
}

// Toast State Interface
interface ToastState {
  toasts: ToastItem[];
}

// Toast Action Types
type ToastAction =
  | { type: 'ADD_TOAST'; payload: ToastItem }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'CLEAR_ALL' };

// Initial State
const initialState: ToastState = {
  toasts: [],
};

// Toast Reducer
function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
}

// Toast Context Interface
interface ToastContextType {
  toasts: ToastItem[];
  showToast: (type: ToastType, title: string, message?: string, duration?: number, onPress?: () => void) => void;
  showSuccess: (title: string, message?: string, duration?: number, onPress?: () => void) => void;
  showError: (title: string, message?: string, duration?: number, onPress?: () => void) => void;
  showWarning: (title: string, message?: string, duration?: number, onPress?: () => void) => void;
  showInfo: (title: string, message?: string, duration?: number, onPress?: () => void) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

// Create Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast Provider Props
interface ToastProviderProps {
  children: ReactNode;
}

// Toast Provider Component
export function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const showToast = (
    type: ToastType,
    title: string,
    message?: string,
    duration: number = 4000,
    onPress?: () => void
  ) => {
    const toast: ToastItem = {
      id: generateId(),
      type,
      title,
      message,
      duration,
      onPress,
    };

    dispatch({ type: 'ADD_TOAST', payload: toast });
  };

  const showSuccess = (title: string, message?: string, duration?: number, onPress?: () => void) => {
    showToast('success', title, message, duration, onPress);
  };

  const showError = (title: string, message?: string, duration?: number, onPress?: () => void) => {
    showToast('error', title, message, duration, onPress);
  };

  const showWarning = (title: string, message?: string, duration?: number, onPress?: () => void) => {
    showToast('warning', title, message, duration, onPress);
  };

  const showInfo = (title: string, message?: string, duration?: number, onPress?: () => void) => {
    showToast('info', title, message, duration, onPress);
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  const value: ToastContextType = {
    toasts: state.toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAll,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

// Custom hook to use toast context
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
