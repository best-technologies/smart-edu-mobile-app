import React from 'react';
import { View } from 'react-native';
import Toast from './Toast';
import { useToast } from '@/contexts/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  // Only show the most recent toast to prevent overlapping
  const latestToast = toasts[toasts.length - 1];
  
  console.log('ToastContainer render:', { toastsCount: toasts.length, latestToast });

  if (!latestToast) {
    return null;
  }

  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      zIndex: 9999999,
      elevation: 9999999,
      pointerEvents: 'box-none',
    }}>
      <Toast
        key={latestToast.id}
        visible={true}
        type={latestToast.type}
        title={latestToast.title}
        message={latestToast.message}
        duration={latestToast.duration}
        onClose={() => removeToast(latestToast.id)}
        onPress={latestToast.onPress}
      />
    </View>
  );
}
