import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar como as notificações devem ser tratadas quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NOTIFICATION_TOKEN_KEY = '@notification_token';

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}

/**
 * Registra o dispositivo para receber notificações push
 * Retorna o token FCM/Expo Push Token
 * Funciona tanto em dispositivos físicos quanto em emuladores
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  // Configura o canal de notificação para Android (funciona em emulador também)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      enableVibrate: true,
    });
  }

  // Solicita permissões (funciona em emulador também)
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('⚠️ Permissão de notificação negada');
    console.log('📱 Notificações locais ainda funcionarão no emulador');
    return null;
  }

  console.log('✅ Permissão de notificação concedida');

  // Tenta obter token de push (só funciona em dispositivo físico, mas não bloqueia notificações locais)
  if (Device.isDevice) {
    try {
      // Obtém o project ID do expo-constants ou usa um fallback
      const projectId = Constants.expoConfig?.extra?.eas?.projectId || 
                        Constants.easConfig?.projectId || 
                        'mottu-ed692';
      
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      token = tokenData.data;
      
      // Salva o token no AsyncStorage
      await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);
      console.log('✅ Token de notificação push registrado:', token);
    } catch (error) {
      console.warn('⚠️ Não foi possível obter token push (normal em emulador):', error);
      console.log('📱 Notificações locais ainda funcionarão normalmente');
    }
  } else {
    console.log('📱 Emulador detectado - notificações locais funcionarão normalmente');
    console.log('💡 Para push notifications reais, use um dispositivo físico');
  }

  return token;
}

/**
 * Obtém o token de notificação salvo
 */
export async function getNotificationToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
}

/**
 * Envia uma notificação local (funciona em emulador e dispositivo físico)
 */
export async function scheduleLocalNotification(notification: NotificationData) {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // null = mostra imediatamente
    });
    
    console.log('✅ Notificação local agendada com ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('❌ Erro ao agendar notificação local:', error);
    throw error;
  }
}

/**
 * Envia uma notificação de teste quando uma moto é cadastrada
 */
export async function notifyMotoRegistered(motoData: { modelo: string; placa: string }) {
  await scheduleLocalNotification({
    title: 'Nova Moto Cadastrada / New Moto Registered',
    body: `Moto ${motoData.modelo} (${motoData.placa}) foi cadastrada com sucesso! / Moto ${motoData.modelo} (${motoData.placa}) was registered successfully!`,
    data: {
      type: 'moto_registered',
      moto: motoData,
    },
  });
}

/**
 * Envia uma notificação quando o status de uma moto muda
 */
export async function notifyMotoStatusChanged(
  motoData: { modelo: string; placa: string },
  oldStatus: string,
  newStatus: string
) {
  await scheduleLocalNotification({
    title: 'Status da Moto Atualizado / Moto Status Updated',
    body: `Moto ${motoData.modelo} (${motoData.placa}) mudou de ${oldStatus} para ${newStatus} / Moto ${motoData.modelo} (${motoData.placa}) changed from ${oldStatus} to ${newStatus}`,
    data: {
      type: 'moto_status_changed',
      moto: motoData,
      oldStatus,
      newStatus,
    },
  });
}

/**
 * Configura listeners para notificações recebidas
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void
) {
  // Listener para quando uma notificação é recebida (app em primeiro plano)
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notificação recebida:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    }
  );

  // Listener para quando o usuário toca na notificação
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('Notificação tocada:', response);
      if (onNotificationTapped) {
        onNotificationTapped(response);
      }
    }
  );

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}

