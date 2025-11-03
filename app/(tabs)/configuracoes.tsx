import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useThemedStyles } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';

export default function Configuracoes() {
  const { theme, setThemeMode, toggleTheme } = useTheme();
  const { translations, language, setLanguage } = useLanguage();
  const styles = useThemedStyles(createStyles);

  const handleThemeModeChange = async (mode: 'light' | 'dark' | 'auto') => {
    await setThemeMode(mode);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⚙️ {translations.settings}</Text>

      {/* Seção de Tema */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 {translations.appearance}</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon-outline" size={24} color={theme.colors.primary} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>{translations.darkMode}</Text>
              <Text style={styles.settingDescription}>
                {theme.mode === 'auto' 
                  ? `${translations.automatic} (segue o sistema)` 
                  : theme.mode === 'dark' 
                    ? `Sempre ${translations.dark.toLowerCase()}` 
                    : `Sempre ${translations.light.toLowerCase()}`
                }
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
            <Ionicons 
              name={theme.isDark ? "moon" : "sunny"} 
              size={20} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Opções de tema */}
        <View style={styles.themeOptions}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              theme.mode === 'light' && styles.themeOptionActive
            ]}
            onPress={() => handleThemeModeChange('light')}
          >
            <Ionicons name="sunny" size={20} color={theme.colors.primary} />
            <Text style={styles.themeOptionText}>{translations.light}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme.mode === 'dark' && styles.themeOptionActive
            ]}
            onPress={() => handleThemeModeChange('dark')}
          >
            <Ionicons name="moon" size={20} color={theme.colors.primary} />
            <Text style={styles.themeOptionText}>{translations.dark}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme.mode === 'auto' && styles.themeOptionActive
            ]}
            onPress={() => handleThemeModeChange('auto')}
          >
            <Ionicons name="phone-portrait" size={20} color={theme.colors.primary} />
            <Text style={styles.themeOptionText}>{translations.automatic}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção de Idioma */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌐 {translations.language}</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="language" size={24} color={theme.colors.primary} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>{translations.language}</Text>
              <Text style={styles.settingDescription}>
                {language === 'pt' ? 'Português (Brasil)' : 'English (US)'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setLanguage(language === 'pt' ? 'en' : 'pt')} style={styles.toggleButton}>
            <Ionicons 
              name="swap-horizontal" 
              size={20} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Opções de idioma */}
        <View style={styles.languageOptions}>
          <TouchableOpacity
            style={[
              styles.languageOption,
              language === 'pt' && styles.languageOptionActive
            ]}
            onPress={() => setLanguage('pt')}
          >
            <Text style={styles.flagEmoji}>🇧🇷</Text>
            <Text style={styles.languageOptionText}>Português</Text>
            <Text style={styles.languageSubText}>Brasil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageOption,
              language === 'en' && styles.languageOptionActive
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text style={styles.flagEmoji}>🇺🇸</Text>
            <Text style={styles.languageOptionText}>English</Text>
            <Text style={styles.languageSubText}>United States</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção de Informações do App */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 {translations.about}</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{translations.appName}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{translations.version}:</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{translations.currentTheme}:</Text>
          <Text style={styles.infoValue}>
            {theme.isDark ? `🌙 ${translations.dark}` : `☀️ ${translations.light}`}
          </Text>
        </View>
      </View>

      {/* Seção de Desenvolvedores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👨‍💻 {translations.developers}</Text>
        
        <View style={styles.devItem}>
          <Text style={styles.devName}>Fernando Aguiar</Text>
          <Text style={styles.devRole}>Desenvolvedor Full Stack</Text>
        </View>
        
        <View style={styles.devItem}>
          <Text style={styles.devName}>Gabriela Macedo</Text>
          <Text style={styles.devRole}>Desenvolvedora Frontend</Text>
        </View>
        
        <View style={styles.devItem}>
          <Text style={styles.devName}>Rafael Mocoto</Text>
          <Text style={styles.devRole}>Desenvolvedor Mobile</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  toggleButton: {
    backgroundColor: colors.surfaceVariant,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  themeOptionActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  themeOptionText: {
    color: colors.text,
    fontWeight: '500',
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 15,
  },
  languageOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  languageOptionActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  flagEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  languageOptionText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  languageSubText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '400',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  devItem: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  devName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  devRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
