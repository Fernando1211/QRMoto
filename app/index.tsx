import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../service/firebaseConfig';
import { useAuth } from '../src/context/AuthContext';
import { useThemedStyles, useTheme } from '../src/context/ThemeContext';
import { useLanguage } from '../src/context/LanguageContext';

const FIRST_TAB_ROUTE = '/cadastro'; // <<< troque aqui se quiser outra aba inicial

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [emailReset, setEmailReset] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [cadastroVisible, setCadastroVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');

  const router = useRouter();
  const { isLogged, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { translations, toggleLanguage } = useLanguage();
  const styles = useThemedStyles(createStyles);

  // ✅ Se já estiver logado (cache/auto-login), vai direto para a navegação
  useEffect(() => {
    if (isLogged) {
      router.replace(FIRST_TAB_ROUTE);
    }
  }, [isLogged]);

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await login(user);                 // salva no contexto/AsyncStorage
        router.replace(FIRST_TAB_ROUTE);   // ✅ vai para a navegação (abas aparecem)
      })
      .catch((error) => {
        console.log('Error:', error.message);
        Alert.alert('Erro', 'Email ou senha inválidos!');
      });
  };

  const handleResetSenha = async () => {
    if (!emailReset) {
      Alert.alert('Atenção', 'Digite seu email para redefinir a senha!');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, emailReset);
      Alert.alert('Sucesso', '📩 Email enviado para redefinir sua senha!');
      setEmailReset('');
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível enviar o email. Verifique se está correto.');
    }
  };

  const handleCadastro = () => {
    if (!nome || !emailCadastro || !senhaCadastro) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    createUserWithEmailAndPassword(auth, emailCadastro, senhaCadastro)
      .then(async (userCredential) => {
        const user = userCredential.user;

        try {
          await updateProfile(user, { displayName: nome.trim() });
        } catch {
          // se falhar, mantemos o nome localmente via login(..., nome)
        }

        await login(user, nome);           // aceita 2º arg opcional (AuthContext ajustado)
        setCadastroVisible(false);
        router.replace(FIRST_TAB_ROUTE);   // ✅ mostra as abas imediatamente
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert('Erro', 'Usuário não cadastrado.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{translations.login}</Text>

      <TextInput
        style={styles.input}
        placeholder={translations.email}
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder={translations.password}
        placeholderTextColor={theme.colors.textSecondary}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>{translations.login}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCadastroVisible(true)}>
        <Text style={styles.link}>{translations.signUp}</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => setModalVisible(true)}>
        {translations.forgotPassword}
      </Text>

      {/* Botões de controle centralizados */}
      <View style={styles.controlButtons}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleLanguage}>
          <Ionicons name="language" size={20} color={theme.colors.primary} />
          <Text style={styles.controlButtonText}>PT/EN</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={toggleTheme}>
          <Ionicons 
            name={theme.isDark ? "moon" : "sunny"} 
            size={20} 
            color={theme.colors.primary} 
          />
          <Text style={styles.controlButtonText}>
            {theme.isDark ? "Dark" : "Light"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal: Redefinir Senha */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.box}>
            <Text style={styles.tituloModal}>🔑 {translations.forgotPassword}</Text>
            <Text style={styles.subtituloModal}>
              Digite seu email para receber o link de redefinição:
            </Text>

            <TextInput
              style={styles.input}
              placeholder={translations.email}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailReset}
              onChangeText={setEmailReset}
            />

            <TouchableOpacity style={styles.botao} onPress={handleResetSenha}>
              <Text style={styles.textoBotao}>Enviar Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, { backgroundColor: theme.colors.surfaceVariant, marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textoBotao}>{translations.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal: Cadastro */}
      <Modal
        visible={cadastroVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCadastroVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.box}>
            <Text style={styles.tituloModal}>{translations.signUp}</Text>

            <TextInput
              style={styles.input}
              placeholder={translations.name}
              placeholderTextColor={theme.colors.textSecondary}
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              style={styles.input}
              placeholder={translations.email}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailCadastro}
              onChangeText={setEmailCadastro}
            />

            <TextInput
              style={styles.input}
              placeholder={translations.password}
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry
              value={senhaCadastro}
              onChangeText={setSenhaCadastro}
            />

            <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
              <Text style={styles.textoBotao}>{translations.signUp}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, { backgroundColor: theme.colors.surfaceVariant, marginTop: 10 }]}
              onPress={() => setCadastroVisible(false)}
            >
              <Text style={styles.textoBotao}>{translations.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: colors.background, 
    justifyContent: 'center', 
    padding: 20,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  controlButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  titulo: {
    fontSize: 28, 
    fontWeight: 'bold', 
    color: colors.text, 
    marginBottom: 30, 
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.input, 
    color: colors.text, 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 15,
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: colors.border,
  },
  botao: {
    backgroundColor: colors.button, 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center',
  },
  textoBotao: {
    color: colors.buttonText, 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  link: { 
    marginTop: 20, 
    color: colors.primary, 
    textAlign: 'center', 
    fontSize: 15 
  },
  modalContainer: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    padding: 20,
  },
  box: { 
    backgroundColor: colors.surface, 
    padding: 25, 
    borderRadius: 15 
  },
  tituloModal: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: colors.primary, 
    marginBottom: 10, 
    textAlign: 'center',
  },
  subtituloModal: { 
    fontSize: 15, 
    color: colors.textSecondary, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
});
