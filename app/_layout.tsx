import { Slot } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { LanguageProvider } from '../src/context/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Slot /> {/* Isso vai decidir se mostra index.tsx ou (tabs)/_layout.tsx */}
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
