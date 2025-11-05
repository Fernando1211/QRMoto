import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { LanguageProvider } from '../src/context/LanguageContext';
import { registerForPushNotificationsAsync, setupNotificationListeners } from '../service/notificationService';

function NotificationSetup() {
  useEffect(() => {
    // Registra para notificações push quando o app inicia
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        console.log('Push notification token:', token);
      }
    });

    // Configura listeners para notificações
    const cleanup = setupNotificationListeners(
      (notification) => {
        console.log('Notification received:', notification);
      },
      (response) => {
        console.log('Notification tapped:', response);
      }
    );

    return cleanup;
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationSetup />
          <Slot /> {/* Isso vai decidir se mostra index.tsx ou (tabs)/_layout.tsx */}
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
