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
  close: string;
  back: string;
  next: string;
  done: string;
  
  // Alertas e Mensagens
  attention: string;
  fillAllFields: string;
  invalidEmailOrPassword: string;
  enterEmailForReset: string;
  emailSent: string;
  emailSentMessage: string;
  couldNotSendEmail: string;
  userNotRegistered: string;
  enterEmailReset: string;
  sendEmail: string;
  modelRequired: string;
  plateRequired: string;
  selectStatusRequired: string;
  motoRegisteredSuccess: string;
  motoEditedSuccess: string;
  motoDeletedSuccess: string;
  errorRegisteringMoto: string;
  errorEditingMoto: string;
  errorDeletingMoto: string;
  requestError: string;
  checkConnection: string;
  deleteMotoConfirm: string;
  deleteMotoConfirmMessage: string;
  noWingRegistered: string;
  registerWingFirst: string;
  errorLoadingWings: string;
  errorLoadingWingsMessage: string;
  errorLoadingWingsCheck: string;
  errorLoadingWingsUrl: string;
  cache: string;
  wingsLoadedFromCache: string;
  noneRegistered: string;
  reloadWings: string;
  wingNameRequired: string;
  wingRegisteredSuccess: string;
  wingDeletedSuccess: string;
  errorRegisteringWing: string;
  errorDeletingWing: string;
  networkError: string;
  tryAgain: string;
  deleteWingConfirm: string;
  deleteWingConfirmMessage: string;
  nameField: string;
  always: string;
  followSystem: string;
  developerFullStack: string;
  developerFrontend: string;
  developerMobile: string;
  noUserLogged: string;
  profileUpdated: string;
  couldNotSaveChanges: string;
  emailUpdateWarning: string;
  emailUpdateWarningMessage: string;
  maintenanceStatus: string;
  recoveryStatus: string;
  modelField: string;
  positionField: string;
  problemField: string;
  plateField: string;
  statusField: string;
  wingField: string;
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
  
  // Alertas e Mensagens
  attention: 'Atenção',
  fillAllFields: 'Preencha todos os campos!',
  invalidEmailOrPassword: 'Email ou senha inválidos!',
  enterEmailForReset: 'Digite seu email para redefinir a senha!',
  emailSent: '📩 Email enviado para redefinir sua senha!',
  emailSentMessage: 'Email enviado para redefinir sua senha!',
  couldNotSendEmail: 'Não foi possível enviar o email. Verifique se está correto.',
  userNotRegistered: 'Usuário não cadastrado.',
  enterEmailReset: 'Digite seu email para receber o link de redefinição:',
  sendEmail: 'Enviar Email',
  modelRequired: 'O campo Modelo é obrigatório',
  plateRequired: 'O campo Placa é obrigatório',
  selectStatusRequired: 'Selecione um Status',
  motoRegisteredSuccess: 'Moto cadastrada com sucesso!',
  motoEditedSuccess: 'Moto editada com sucesso!',
  motoDeletedSuccess: 'Moto excluída com sucesso!',
  errorRegisteringMoto: 'Erro ao cadastrar a moto:',
  errorEditingMoto: 'Erro ao editar a moto:',
  errorDeletingMoto: 'Erro ao excluir moto:',
  requestError: 'Erro na requisição. Verifique sua conexão.',
  checkConnection: 'Verifique sua conexão.',
  deleteMotoConfirm: 'Excluir Moto',
  deleteMotoConfirmMessage: 'Tem certeza que deseja excluir esta moto?',
  noWingRegistered: 'Nenhuma ala cadastrada',
  registerWingFirst: 'Cadastre uma ala primeiro.',
  errorLoadingWings: 'Erro ao Carregar Alas',
  errorLoadingWingsMessage: 'Não foi possível carregar as alas. Verifique:\n\n1. Se o backend está rodando\n2. Se a URL está correta\n3. Se existe o endpoint /api/alas',
  errorLoadingWingsCheck: 'Não foi possível carregar as alas.',
  errorLoadingWingsUrl: 'Se existe o endpoint /api/alas',
  cache: 'Cache',
  wingsLoadedFromCache: 'ala(s) carregada(s) do cache',
  noneRegistered: 'Nenhuma',
  reloadWings: 'Recarregar Alas',
  wingNameRequired: 'Preencha o nome da Ala!',
  wingRegisteredSuccess: 'Ala cadastrada com sucesso!',
  wingDeletedSuccess: 'Ala excluída com sucesso!',
  errorRegisteringWing: 'Falha ao cadastrar (status',
  errorDeletingWing: 'Erro ao excluir (status',
  networkError: 'Erro de rede.',
  tryAgain: 'Tente novamente.',
  deleteWingConfirm: 'Excluir Ala',
  deleteWingConfirmMessage: 'Tem certeza que deseja excluir esta ala?',
  nameField: 'Nome:',
  always: 'Sempre',
  followSystem: 'segue o sistema',
  developerFullStack: 'Desenvolvedor Full Stack',
  developerFrontend: 'Desenvolvedora Frontend',
  developerMobile: 'Desenvolvedor Mobile',
  noUserLogged: 'Nenhum usuário logado.',
  profileUpdated: 'Perfil atualizado.',
  couldNotSaveChanges: 'Não foi possível salvar as alterações.',
  emailUpdateWarning: 'Aviso',
  emailUpdateWarningMessage: 'Não foi possível atualizar o e-mail no Firebase agora (pode exigir reautenticação). O e-mail foi atualizado localmente.',
  maintenanceStatus: 'Manutenção',
  recoveryStatus: 'Recuperação',
  modelField: 'Modelo:',
  positionField: 'Posição:',
  problemField: 'Problema:',
  plateField: 'Placa:',
  statusField: 'Status:',
  wingField: 'Ala:',
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
  
  // Alertas e Mensagens
  attention: 'Attention',
  fillAllFields: 'Fill all fields!',
  invalidEmailOrPassword: 'Invalid email or password!',
  enterEmailForReset: 'Enter your email to reset password!',
  emailSent: '📩 Email sent to reset your password!',
  emailSentMessage: 'Email sent to reset your password!',
  couldNotSendEmail: 'Could not send email. Please check if it is correct.',
  userNotRegistered: 'User not registered.',
  enterEmailReset: 'Enter your email to receive the reset link:',
  sendEmail: 'Send Email',
  modelRequired: 'Model field is required',
  plateRequired: 'Plate field is required',
  selectStatusRequired: 'Select a Status',
  motoRegisteredSuccess: 'Moto registered successfully!',
  motoEditedSuccess: 'Moto edited successfully!',
  motoDeletedSuccess: 'Moto deleted successfully!',
  errorRegisteringMoto: 'Error registering moto:',
  errorEditingMoto: 'Error editing moto:',
  errorDeletingMoto: 'Error deleting moto:',
  requestError: 'Request error. Check your connection.',
  checkConnection: 'Check your connection.',
  deleteMotoConfirm: 'Delete Moto',
  deleteMotoConfirmMessage: 'Are you sure you want to delete this moto?',
  noWingRegistered: 'No wing registered',
  registerWingFirst: 'Register a wing first.',
  errorLoadingWings: 'Error Loading Wings',
  errorLoadingWingsMessage: 'Could not load wings. Check:\n\n1. If backend is running\n2. If URL is correct\n3. If /api/wings endpoint exists',
  errorLoadingWingsCheck: 'Could not load wings.',
  errorLoadingWingsUrl: 'If /api/wings endpoint exists',
  cache: 'Cache',
  wingsLoadedFromCache: 'wing(s) loaded from cache',
  noneRegistered: 'None',
  reloadWings: 'Reload Wings',
  wingNameRequired: 'Fill wing name!',
  wingRegisteredSuccess: 'Wing registered successfully!',
  wingDeletedSuccess: 'Wing deleted successfully!',
  errorRegisteringWing: 'Failed to register (status',
  errorDeletingWing: 'Error deleting (status',
  networkError: 'Network error.',
  tryAgain: 'Try again.',
  deleteWingConfirm: 'Delete Wing',
  deleteWingConfirmMessage: 'Are you sure you want to delete this wing?',
  nameField: 'Name:',
  always: 'Always',
  followSystem: 'follows system',
  developerFullStack: 'Full Stack Developer',
  developerFrontend: 'Frontend Developer',
  developerMobile: 'Mobile Developer',
  noUserLogged: 'No user logged in.',
  profileUpdated: 'Profile updated.',
  couldNotSaveChanges: 'Could not save changes.',
  emailUpdateWarning: 'Warning',
  emailUpdateWarningMessage: 'Could not update email in Firebase now (may require re-authentication). Email was updated locally.',
  maintenanceStatus: 'Maintenance',
  recoveryStatus: 'Recovery',
  modelField: 'Model:',
  positionField: 'Position:',
  problemField: 'Problem:',
  plateField: 'Plate:',
  statusField: 'Status:',
  wingField: 'Wing:',
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
