import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { LanguageProvider } from '../src/context/LanguageContext';
import { registerForPushNotificationsAsync, setupNotificationListeners } from '../service/notificationService';

function NotificationSetup() {
  useEffect(() => {
    // Registra para notificações quando o app inicia (funciona em emulador também)
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        console.log('✅ Push notification token registrado:', token);
      } else {
        console.log('📱 Modo emulador - notificações locais ativas');
      }
    }).catch(error => {
      console.error('❌ Erro ao registrar notificações:', error);
    });

    // Configura listeners para notificações
    const cleanup = setupNotificationListeners(
      (notification) => {
        console.log('📬 Notificação recebida:', notification.request.content.title);
      },
      (response) => {
        console.log('👆 Notificação tocada:', response.notification.request.content.title);
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
