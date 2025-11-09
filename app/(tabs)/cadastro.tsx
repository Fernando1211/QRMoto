import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useThemedStyles, useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';

type Moto = {
  id?: number;
  modelo: string;
  status: string;
  posicao: string;
  problema: string;
  placa: string;
  alaId?: number;
  ala?: {
    id: number;
    nome: string;
  };
};

type Ala = {
  id: number;
  nome: string;
};

const CAMPOS_FORM = ['modelo', 'posicao', 'problema', 'placa'] as const;
const STATUS_OPTIONS = ['DISPONIVEL', 'MANUTENCAO', 'INDISPONIVEL', 'RECUPERACAO'];
const API_BASE_URL = 'http://10.0.2.2:5237/api'; // ✅ URL corrigida

export default function Cadastro() {
  const [moto, setMoto] = useState<Moto>({
    modelo: '',
    status: '',
    posicao: '',
    problema: '',
    placa: '',
    alaId: undefined,
  });

  const [alas, setAlas] = useState<Ala[]>([]);
  const [listaMotos, setListaMotos] = useState<Moto[]>([]);
  const [loadingAlas, setLoadingAlas] = useState(false);
  const [loadingMotos, setLoadingMotos] = useState(false);
  const styles = useThemedStyles(createStyles);
  const { translations } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    carregarDados();
  }, []);

  // Carrega dados iniciais
  const carregarDados = async () => {
    await Promise.all([listarMotos(), carregarAlas()]);
  };

  // Carrega alas cadastradas
  const carregarAlas = async () => {
    setLoadingAlas(true);
    try {
      console.log('🔄 Carregando alas de:', `${API_BASE_URL}/alas`);
      
      const response = await fetch(`${API_BASE_URL}/alas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Status da resposta:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Dados recebidos:', JSON.stringify(data, null, 2));

      // Trata diferentes formatos de resposta
      let listaAlas: Ala[] = [];
      
      if (Array.isArray(data)) {
        listaAlas = data;
      } else if (data.content && Array.isArray(data.content)) {
        listaAlas = data.content;
      } else if (data.data && Array.isArray(data.data)) {
        listaAlas = data.data;
      } else if (data.items && Array.isArray(data.items)) {
        listaAlas = data.items;
      }

      console.log('✅ Alas processadas:', listaAlas.length, 'encontradas');
      setAlas(listaAlas);

      // Salva no AsyncStorage para cache
      await AsyncStorage.setItem('alas', JSON.stringify(listaAlas));

      if (listaAlas.length === 0) {
        Alert.alert(translations.warning, `${translations.noWingRegistered}. ${translations.registerWingFirst}`);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar alas:', error);
      Alert.alert(
        translations.errorLoadingWings, 
        translations.errorLoadingWingsMessage
      );
      
      // Tenta carregar do cache
      try {
        const cached = await AsyncStorage.getItem('alas');
        if (cached) {
          const cachedAlas = JSON.parse(cached);
          setAlas(cachedAlas);
          Alert.alert(translations.cache, `${cachedAlas.length} ${translations.wingsLoadedFromCache}`);
        }
      } catch (e) {
        console.error('Erro ao carregar cache:', e);
      }
    } finally {
      setLoadingAlas(false);
    }
  };

  // Lista motos cadastradas
  const listarMotos = useCallback(async () => {
    setLoadingMotos(true);
    try {
      console.log('🔄 Carregando motos de:', `${API_BASE_URL}/motos`);
      
      const response = await fetch(`${API_BASE_URL}/motos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Resposta completa:', JSON.stringify(data, null, 2));
      
      const motos = data.content || data.data || data.items || data;
      
      if (Array.isArray(motos) && motos.length > 0) {
        console.log('🔍 Primeira moto (exemplo):', JSON.stringify(motos[0], null, 2));
        console.log('🔍 alaId da primeira moto:', motos[0].alaId);
        console.log('🔍 ala da primeira moto:', motos[0].ala);
      }
      
      setListaMotos(Array.isArray(motos) ? motos : []);
      await AsyncStorage.setItem('listaMotos', JSON.stringify(motos));
      
      console.log('✅ Total de motos:', Array.isArray(motos) ? motos.length : 0);
    } catch (error) {
      console.error('❌ Erro ao buscar motos:', error);
      
      // Tenta carregar do cache
      try {
        const cached = await AsyncStorage.getItem('listaMotos');
        if (cached) {
          setListaMotos(JSON.parse(cached));
        }
      } catch (e) {
        console.error('Erro ao carregar cache:', e);
      }
    } finally {
      setLoadingMotos(false);
    }
  }, []);

  const handleChange = (field: keyof Moto, value: any) => {
    setMoto((prev) => ({ ...prev, [field]: value }));
  };

  const limparCampos = () => {
    setMoto({
      id: undefined,
      modelo: '',
      status: '',
      posicao: '',
      problema: '',
      placa: '',
      alaId: undefined,
    });
  };

  const validarCampos = (): boolean => {
    if (!moto.modelo.trim()) {
      Alert.alert(translations.error, translations.modelRequired);
      return false;
    }
    if (!moto.placa.trim()) {
      Alert.alert(translations.error, translations.plateRequired);
      return false;
    }
    if (!moto.status) {
      Alert.alert(translations.error, translations.selectStatusRequired);
      return false;
    }
    return true;
  };

  const cadastrarMoto = async () => {
    if (!validarCampos()) return;

    try {
      // Garante que alaId seja enviado como número ou null
      const motoParaEnviar = {
        ...moto,
        alaId: moto.alaId ? Number(moto.alaId) : null
      };
      
      console.log('📤 Cadastrando moto:', JSON.stringify(motoParaEnviar, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/motos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(motoParaEnviar),
      });

      if (response.ok) {
        const motoRetornada = await response.json();
        console.log('✅ Moto retornada pelo backend:', JSON.stringify(motoRetornada, null, 2));
        
        Alert.alert(translations.success, translations.motoRegisteredSuccess);
        limparCampos();
        await listarMotos();
      } else {
        const text = await response.text();
        console.error('Erro ao cadastrar:', text);
        Alert.alert(translations.error, `${translations.errorRegisteringMoto} ${text}`);
      }
    } catch (error) {
      console.error('❌ Erro ao cadastrar moto:', error);
      Alert.alert(translations.error, translations.requestError);
    }
  };

  const editarMoto = async (motoEditada: Moto) => {
    if (!motoEditada.id) return;
    if (!validarCampos()) return;

    try {
      console.log('📝 Editando moto:', motoEditada);
      
      const response = await fetch(`${API_BASE_URL}/motos/${motoEditada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(motoEditada),
      });

      if (response.ok) {
        Alert.alert(translations.success, translations.motoEditedSuccess);
        await listarMotos();
        limparCampos();
      } else {
        const text = await response.text();
        Alert.alert(translations.error, `${translations.errorEditingMoto} ${text}`);
      }
    } catch (error) {
      console.error('❌ Erro ao editar moto:', error);
      Alert.alert(translations.error, translations.requestError);
    }
  };

  const excluirMoto = async (id?: number) => {
    if (!id) return;

    try {
      console.log('🗑️ Excluindo moto:', id);
      
      const response = await fetch(`${API_BASE_URL}/motos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert(translations.success, translations.motoDeletedSuccess);
        await listarMotos();
      } else {
        const text = await response.text();
        Alert.alert(translations.error, `${translations.errorDeletingMoto} ${text}`);
      }
    } catch (error) {
      console.error('❌ Erro ao excluir moto:', error);
      Alert.alert(translations.error, translations.requestError);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 {translations.motoRegistration}</Text>

      <TextInput
        style={styles.input}
        placeholder={translations.model}
        placeholderTextColor={theme.colors.textSecondary}
        value={moto.modelo}
        onChangeText={(value) => handleChange('modelo', value)}
      />
      <TextInput
        style={styles.input}
        placeholder={translations.position}
        placeholderTextColor={theme.colors.textSecondary}
        value={moto.posicao}
        onChangeText={(value) => handleChange('posicao', value)}
      />
      <TextInput
        style={styles.input}
        placeholder={translations.problem}
        placeholderTextColor={theme.colors.textSecondary}
        value={moto.problema}
        onChangeText={(value) => handleChange('problema', value)}
      />
      <TextInput
        style={styles.input}
        placeholder={translations.plate}
        placeholderTextColor={theme.colors.textSecondary}
        value={moto.placa}
        onChangeText={(value) => handleChange('placa', value)}
      />

      {/* STATUS */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={moto.status}
          onValueChange={(value) => handleChange('status', value)}
          dropdownIconColor={theme.colors.primary}
          style={styles.picker}
        >
          <Picker.Item label={translations.selectStatus} value="" color="#000000" />
          <Picker.Item label={translations.available} value="DISPONIVEL" color="#000000" />
          <Picker.Item label={translations.maintenance} value="MANUTENCAO" color="#000000" />
          <Picker.Item label={translations.unavailable} value="INDISPONIVEL" color="#000000" />
          <Picker.Item label={translations.recovery} value="RECUPERACAO" color="#000000" />
        </Picker>
      </View>

      {/* ALA */}
      <View style={styles.pickerContainer}>
        {loadingAlas ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000000" />
            <Text style={styles.loadingText}>{translations.loading}</Text>
          </View>
        ) : (
          <Picker
            selectedValue={moto.alaId}
            onValueChange={(value) => handleChange('alaId', value)}
            dropdownIconColor={theme.colors.primary}
            style={styles.picker}
          >
            <Picker.Item label={translations.selectWing} value={undefined} color={theme.colors.textSecondary} />
            {alas.map((ala) => (
              <Picker.Item key={ala.id} label={ala.nome} value={ala.id} color="#000000" />
            ))}
          </Picker>
        )}
      </View>

      {/* Aviso se não houver alas */}
      {alas.length === 0 && !loadingAlas && (
        <View style={styles.warningBox}>
          <MaterialIcons name="warning" size={20} color="#FFA500" />
          <Text style={styles.warningText}>{translations.noWingRegistered}</Text>
        </View>
      )}

      {/* Mostra quantas alas foram carregadas */}
      {alas.length > 0 && (
        <Text style={styles.infoText}>✅ {alas.length} {translations.wing}(s) {translations.available.toLowerCase()}</Text>
      )}

      {/* Botão para recarregar alas */}
      <TouchableOpacity
        onPress={() => carregarAlas()}
        style={styles.refreshButton}
        disabled={loadingAlas}
      >
        <MaterialIcons name="refresh" size={18} color="#fff" />
        <Text style={styles.refreshButtonText}>
          {loadingAlas ? translations.loading : translations.reloadWings}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={moto.id ? () => editarMoto(moto) : cadastrarMoto}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {moto.id ? translations.save : translations.registerMoto}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={limparCampos} style={styles.clearButton}>
        <MaterialIcons name="delete-outline" size={20} color={theme.colors.text} />
        <Text style={styles.clearButtonText}>{translations.clear}</Text>
      </TouchableOpacity>

      {loadingMotos ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle}>📄 {translations.motoList} ({listaMotos.length}):</Text>

          {listaMotos.length === 0 ? (
            <Text style={styles.emptyText}>{translations.noMotos}</Text>
          ) : (
            listaMotos.map((m, index) => (
              <View key={m.id ?? index} style={styles.motoCard}>
                <Text style={styles.previewText}>{translations.modelField} {m.modelo || '---'}</Text>
                <Text style={styles.previewText}>{translations.positionField} {m.posicao || '---'}</Text>
                <Text style={styles.previewText}>{translations.problemField} {m.problema || '---'}</Text>
                <Text style={styles.previewText}>{translations.plateField} {m.placa || '---'}</Text>
                <Text style={styles.previewText}>{translations.statusField} {m.status}</Text>

                <View style={styles.actionsRow}>
                  <TouchableOpacity 
                    onPress={() => {
                      const motoParaEditar = {
                        ...m,
                        alaId: m.alaId || m.ala?.id
                      };
                      setMoto(motoParaEditar);
                    }} 
                    style={styles.editButton}
                  >
                    <MaterialIcons name="edit" size={16} color={theme.colors.buttonText} />
                    <Text style={styles.actionButtonText}>{translations.editMoto}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(translations.deleteMotoConfirm, translations.deleteMotoConfirmMessage, [
                        { text: translations.cancel, style: 'cancel' },
                        { text: translations.delete, onPress: () => excluirMoto(m.id), style: 'destructive' },
                      ])
                    }
                    style={styles.deleteButton}
                  >
                    <MaterialIcons name="delete" size={16} color={theme.colors.buttonText} />
                    <Text style={styles.actionButtonText}>{translations.deleteMoto}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
    borderRadius: 8,
    fontSize: 15,
    color: colors.text,
  },
  pickerContainer: {
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  picker: {
    color: colors.text,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  loadingText: {
    color: colors.textSecondary,
    marginLeft: 8,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    gap: 8,
  },
  warningText: {
    color: colors.warning,
    fontSize: 13,
  },
  infoText: {
    color: colors.success,
    fontSize: 13,
    marginBottom: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  refreshButtonText: {
    color: colors.text,
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.button,
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 6,
  },
  clearButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  previewBox: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    borderColor: colors.border,
    borderWidth: 1,
  },
  previewTitle: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  motoCard: {
    backgroundColor: colors.surfaceVariant,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: colors.border,
    borderWidth: 1,
  },
  previewText: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.info,
    padding: 8,
    borderRadius: 6,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    padding: 8,
    borderRadius: 6,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.buttonText,
    fontSize: 13,
    fontWeight: '600',
  },
});