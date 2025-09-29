import { Slot } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot /> {/* Isso vai decidir se mostra index.tsx ou (tabs)/_layout.tsx */}
    </AuthProvider>
  );
}
