import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemedStyles, useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';

type Ala = {
  id?: number;
  nome: string;
};

// 👉 Troque pelo IP da sua máquina se rodar em celular físico
const BASE_URL = 'http://10.0.2.2:5237'; // Android Emulator

export default function CadastroAla() {
  const [ala, setAla] = useState<Ala>({ nome: '' });
  const [alas, setAlas] = useState<Ala[]>([]);
  const styles = useThemedStyles(createStyles);
  const { translations } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    carregarAlas();
  }, []);

  // Função para carregar a lista de alas
  const carregarAlas = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/alas`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log('GET /api/alas ->', data);

      // Ajusta caso venha como PagedResponse
      const list = data.content ?? data.items ?? data.data ?? data;
      setAlas(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Erro ao carregar alas', err);
      Alert.alert(translations.error, translations.errorLoadingWingsCheck);
    }
  };

  // Função para cadastrar nova Ala
  const handleCadastroAla = async () => {
    if (!ala.nome) {
      Alert.alert(translations.attention, translations.wingNameRequired);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/alas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ala),
      });

      if (response.status === 201) {
        Alert.alert(translations.success, translations.wingRegisteredSuccess);
        carregarAlas();
        setAla({ nome: '' });
      } else {
        const text = await response.text();
        console.error('Erro ao cadastrar:', response.status, text);
        Alert.alert(translations.error, `${translations.errorRegisteringWing} ${response.status})`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar a ala:', error);
      Alert.alert(translations.error, `${translations.networkError} ${translations.tryAgain}`);
    }
  };

  const limparCampos = () => {
    setAla({ nome: '' });
  };

  // Função para excluir Ala
  const excluirAla = async (id?: number) => {
    if (!id) return;

    try {
      const response = await fetch(`${BASE_URL}/api/alas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert(translations.success, translations.wingDeletedSuccess);
        setAlas(alas.filter((ala) => ala.id !== id));
      } else {
        const text = await response.text();
        console.error('Erro ao excluir:', response.status, text);
        Alert.alert(translations.error, `${translations.errorDeletingWing} ${response.status})`);
      }
    } catch (error) {
      console.error('Erro ao excluir ala:', error);
      Alert.alert(translations.error, `${translations.networkError} ${translations.delete.toLowerCase()}.`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>📋 {translations.wingRegistration}</Text>

      <TextInput
        style={styles.input}
        placeholder={translations.wingName}
        placeholderTextColor={theme.colors.textSecondary}
        value={ala.nome}
        onChangeText={(value) => setAla({ nome: value })}
      />

      <TouchableOpacity onPress={handleCadastroAla} style={styles.botao}>
        <Text style={styles.textoBotao}>{translations.registerWing}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={limparCampos} style={styles.clearButton}>
        <MaterialIcons name="delete-outline" size={20} color={theme.colors.text} />
        <Text style={styles.clearButtonText}>{translations.clear}</Text>
      </TouchableOpacity>

      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>📄 {translations.wingList}:</Text>
        {alas.length === 0 && (
          <Text style={{ color: theme.colors.textSecondary }}>{translations.noWings}</Text>
        )}
        {alas.map((alaItem, index) => (
          <View key={alaItem.id ?? index} style={{ marginBottom: 12 }}>
            <Text style={styles.previewText}>{translations.nameField} {alaItem.nome}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={{ color: theme.colors.text }}>{translations.edit}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    translations.deleteWingConfirm,
                    translations.deleteWingConfirmMessage,
                    [
                      { text: translations.cancel, style: 'cancel' },
                      { text: translations.delete, onPress: () => excluirAla(alaItem.id), style: 'destructive' },
                    ]
                  )
                }
                style={[styles.editButton, { backgroundColor: theme.colors.error }]}
              >
                <Text style={{ color: theme.colors.buttonText }}>{translations.delete}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// Styles
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: colors.text,
  },
  botao: {
    backgroundColor: colors.button,
    padding: 14,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  textoBotao: {
    color: colors.buttonText,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  clearButtonText: {
    color: colors.text,
    marginLeft: 6,
    fontSize: 15,
  },
  previewBox: {
    marginTop: 25,
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  previewText: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 3,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 6,
  },
});
