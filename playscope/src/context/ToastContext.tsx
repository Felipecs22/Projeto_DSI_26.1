import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

type ToastType = 'success' | 'error';

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string, toastType: ToastType = 'success') => {
      if (timer.current) clearTimeout(timer.current);

      setMessage(msg);
      setType(toastType);

      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      timer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2500);
    },
    [opacity],
  );

  const bgColor = type === 'success' ? '#00d394' : '#e53e3e';

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[styles.toast, { backgroundColor: bgColor, opacity }]}
      >
        <Text style={styles.toastText}>{message}</Text>
      </Animated.View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});