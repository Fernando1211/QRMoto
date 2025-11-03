import { Tabs } from 'expo-router';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';

export default function TabsLayout() {
  const { theme } = useTheme();
  const { translations } = useLanguage();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="cadastro"
        options={{
          title: translations.register,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cadastrarAla"
        options={{
          title: translations.registerWing,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: translations.map,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="devs"
        options={{
          title: translations.devs,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: translations.config,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: translations.logout,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="exit-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
