import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'pt' | 'en';

export interface Translations {
  // Login/Cadastro
  login: string;
  email: string;
  password: string;
  forgotPassword: string;
  signUp: string;
  name: string;
  signUpSuccess: string;
  loginSuccess: string;
  
  // Navegação
  register: string;
  registerWing: string;
  map: string;
  devs: string;
  config: string;
  logout: string;
  
  // Motos
  motoRegistration: string;
  model: string;
  position: string;
  problem: string;
  plate: string;
  status: string;
  wing: string;
  selectStatus: string;
  selectWing: string;
  available: string;
  maintenance: string;
  unavailable: string;
  recovery: string;
  registerMoto: string;
  editMoto: string;
  deleteMoto: string;
  clear: string;
  motoList: string;
  noMotos: string;
  
  // Alas
  wingRegistration: string;
  wingName: string;
  registerWing: string;
  wingList: string;
  noWings: string;
  
  // Configurações
  settings: string;
  appearance: string;
  darkMode: string;
  language: string;
  about: string;
  appName: string;
  version: string;
  currentTheme: string;
  developers: string;
  light: string;
  dark: string;
  automatic: string;
  
  // Perfil
  profile: string;
  edit: string;
  save: string;
  cancel: string;
  
  // Geral
  success: string;
  error: string;
  warning: string;
  loading: string;
  confirm: string;
  delete: string;
  edit: string;
  save: string;
  cancel: string;
  close: string;
  back: string;
  next: string;
  done: string;
}

const ptTranslations: Translations = {
  // Login/Cadastro
  login: 'Login',
  email: 'E-mail',
  password: 'Senha',
  forgotPassword: 'Esqueceu a senha?',
  signUp: 'Cadastre-se',
  name: 'Nome',
  signUpSuccess: 'Cadastro realizado com sucesso!',
  loginSuccess: 'Login realizado com sucesso!',
  
  // Navegação
  register: 'Cadastro',
  registerWing: 'Cadastro Ala',
  map: 'Mapa',
  devs: 'Devs',
  config: 'Config',
  logout: 'Logout',
  
  // Motos
  motoRegistration: 'Cadastro de Moto',
  model: 'Modelo',
  position: 'Posição',
  problem: 'Problema',
  plate: 'Placa',
  status: 'Status',
  wing: 'Ala',
  selectStatus: 'Selecione o status',
  selectWing: 'Selecione a Ala (opcional)',
  available: 'DISPONIVEL',
  maintenance: 'MANUTENCAO',
  unavailable: 'INDISPONIVEL',
  recovery: 'RECUPERACAO',
  registerMoto: 'Cadastrar Moto',
  editMoto: 'Editar',
  deleteMoto: 'Excluir',
  clear: 'Limpar',
  motoList: 'Lista de Motos',
  noMotos: 'Nenhuma moto cadastrada',
  
  // Alas
  wingRegistration: 'Cadastro de Ala',
  wingName: 'Nome da Ala',
  registerWing: 'Cadastrar Ala',
  wingList: 'Lista de Alas',
  noWings: 'Nenhuma ala encontrada',
  
  // Configurações
  settings: 'Configurações',
  appearance: 'Aparência',
  darkMode: 'Modo Escuro',
  language: 'Idioma',
  about: 'Sobre o App',
  appName: 'QRMoto',
  version: 'Versão',
  currentTheme: 'Tema Atual',
  developers: 'Desenvolvedores',
  light: 'Claro',
  dark: 'Escuro',
  automatic: 'Automático',
  
  // Perfil
  profile: 'Perfil',
  edit: 'Editar',
  save: 'Salvar',
  cancel: 'Cancelar',
  
  // Geral
  success: 'Sucesso',
  error: 'Erro',
  warning: 'Atenção',
  loading: 'Carregando...',
  confirm: 'Confirmar',
  delete: 'Excluir',
  close: 'Fechar',
  back: 'Voltar',
  next: 'Próximo',
  done: 'Concluído',
};

const enTranslations: Translations = {
  // Login/Cadastro
  login: 'Login',
  email: 'Email',
  password: 'Password',
  forgotPassword: 'Forgot password?',
  signUp: 'Sign Up',
  name: 'Name',
  signUpSuccess: 'Registration successful!',
  loginSuccess: 'Login successful!',
  
  // Navegação
  register: 'Register',
  registerWing: 'Register Wing',
  map: 'Map',
  devs: 'Devs',
  config: 'Config',
  logout: 'Logout',
  
  // Motos
  motoRegistration: 'Moto Registration',
  model: 'Model',
  position: 'Position',
  problem: 'Problem',
  plate: 'Plate',
  status: 'Status',
  wing: 'Wing',
  selectStatus: 'Select status',
  selectWing: 'Select Wing (optional)',
  available: 'AVAILABLE',
  maintenance: 'MAINTENANCE',
  unavailable: 'UNAVAILABLE',
  recovery: 'RECOVERY',
  registerMoto: 'Register Moto',
  editMoto: 'Edit',
  deleteMoto: 'Delete',
  clear: 'Clear',
  motoList: 'Moto List',
  noMotos: 'No motos registered',
  
  // Alas
  wingRegistration: 'Wing Registration',
  wingName: 'Wing Name',
  registerWing: 'Register Wing',
  wingList: 'Wing List',
  noWings: 'No wings found',
  
  // Configurações
  settings: 'Settings',
  appearance: 'Appearance',
  darkMode: 'Dark Mode',
  language: 'Language',
  about: 'About App',
  appName: 'QRMoto',
  version: 'Version',
  currentTheme: 'Current Theme',
  developers: 'Developers',
  light: 'Light',
  dark: 'Dark',
  automatic: 'Automatic',
  
  // Perfil
  profile: 'Profile',
  edit: 'Edit',
  save: 'Save',
  cancel: 'Cancel',
  
  // Geral
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  loading: 'Loading...',
  confirm: 'Confirm',
  delete: 'Delete',
  close: 'Close',
  back: 'Back',
  next: 'Next',
  done: 'Done',
};

type LanguageContextType = {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => Promise<void>;
  toggleLanguage: () => Promise<void>;
};

const LANGUAGE_STORAGE_KEY = '@language';

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  translations: ptTranslations,
  setLanguage: async () => {},
  toggleLanguage: async () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o idioma salvo no AsyncStorage
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && ['pt', 'en'].includes(savedLanguage)) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Erro ao carregar idioma:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const translations = language === 'pt' ? ptTranslations : enTranslations;

  const setLanguageAndSave = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
    }
  };

  const toggleLanguage = async () => {
    const newLanguage = language === 'pt' ? 'en' : 'pt';
    await setLanguageAndSave(newLanguage);
  };

  // Não renderiza até carregar o idioma
  if (isLoading) {
    return <></>;
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      translations, 
      setLanguage: setLanguageAndSave, 
      toggleLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
}
