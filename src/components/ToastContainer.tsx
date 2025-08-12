import React from 'react';
import { View } from 'react-native';
import Toast from './Toast';
import { useToast } from '@/contexts/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999 }}>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          visible={true}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
          onPress={toast.onPress}
        />
      ))}
    </View>
  );
}
