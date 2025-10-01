import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator, // Importado para feedback de carregamento
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

// --- Tipos e Constantes ---
type Moto = {
  id?: number;
  modelo: string;
  status: string;
  posicao: string;
  problema: string;
  placa: string;
  alaId?: number;
};

type Ala = {
  id: number;
  nome: string;
};

// 🚨 ATENÇÃO: Verifique se este IP e PORTA estão 100% corretos.
// Verifique o arquivo launchSettings.json no seu backend para a porta correta.
const API_BASE_URL = 'http://10.0.2.2:8080';

const CAMPOS_FORM = ['modelo', 'posicao', 'problema', 'placa'] as const;
const STATUS_OPTIONS = ['DISPONIVEL', 'MANUTENCAO', 'INDISPONIVEL', 'RECUPERACAO'];

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

  // --- NOVO ESTADO PARA CONTROLE DE CARREGAMENTO ---
  const [loadingAlas, setLoadingAlas] = useState(true);

  useEffect(() => {
    listarMotos();
    carregarAlas();
  }, []);

  const listarMotos = useCallback(async () => {
    // ... sua função para listar motos ...
  }, []);

  // --- FUNÇÃO CORRIGIDA PARA CARREGAR ALAS COM FEEDBACK ---
  const carregarAlas = useCallback(async () => {
    setLoadingAlas(true); // Inicia o carregamento
    try {
      const response = await fetch(`${API_BASE_URL}/alas`);
      if (!response.ok) {
        // Se a resposta não for bem-sucedida (ex: erro 404, 500), lança um erro
        throw new Error(`Erro na API: Status ${response.status}`);
      }
      const data = await response.json();
      const lista = data.Data || []; // Data é o array de alas dentro do PagedResponse
      setAlas(lista);

    } catch (error) {
      console.error('Erro ao carregar alas:', error);
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível carregar a lista de alas. Verifique o IP e a Porta da API e se o backend está rodando.'
      );
    } finally {
      setLoadingAlas(false); // Finaliza o carregamento (seja com sucesso ou erro)
    }
  }, []);

  // ... Suas outras funções (handleChange, limparCampos, cadastrarMoto, etc.)
  const handleChange = (field: keyof Moto, value: any) => {
    setMoto((prev) => ({ ...prev, [field]: value }));
  };
  const cadastrarMoto = async () => {};
  const editarMoto = async (motoEditada: Moto) => {};
  const excluirMoto = async (id?: number) => {};
  const limparCampos = () => {};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Cadastro de Moto</Text>

      {CAMPOS_FORM.map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={`Digite ${field}`}
          placeholderTextColor="#ccc"
          value={moto[field]}
          onChangeText={(value) => handleChange(field, value)}
        />
      ))}

      {/* STATUS PICKER */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={moto.status}
          onValueChange={(value) => handleChange('status', value)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o status" value="" />
          {STATUS_OPTIONS.map((status) => (
            <Picker.Item key={status} label={status} value={status} />
          ))}
        </Picker>
      </View>

      {/* --- PICKER DE ALA CORRIGIDO --- */}
      <View style={styles.pickerContainer}>
        {loadingAlas ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#00BFFF" />
            <Text style={styles.loadingText}>Carregando Alas...</Text>
          </View>
        ) : (
          <Picker
            selectedValue={moto.alaId}
            onValueChange={(value) => handleChange('alaId', value)}
            style={styles.picker}
            enabled={!loadingAlas}
          >
             <Picker.Item label="Selecione a Ala" value={undefined} />
              {alas.map((ala) => (
            <Picker.Item key={ala.id} label={ala.nome} value={ala.id} />
            ))}
          </Picker>
        )}
      </View>

      <TouchableOpacity
        onPress={moto.id ? () => editarMoto(moto) : cadastrarMoto}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {moto.id ? 'Salvar Alterações' : 'Cadastrar Moto'}
        </Text>
      </TouchableOpacity>

      {/* ... Resto do seu JSX ... */}
      
    </ScrollView>
  );
}

// --- ESTILOS ---
// (Adicione os novos estilos `loadingContainer` e `loadingText`)
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000', padding: 20, alignItems: 'center' },
  title: { fontSize: 20, color: '#00BFFF', fontWeight: 'bold', marginBottom: 15 },
  input: { width: '100%', backgroundColor: '#1a1a1a', borderColor: '#333', borderWidth: 1, marginBottom: 10, padding: 12, borderRadius: 8, fontSize: 15, color: '#fff' },
  pickerContainer: { backgroundColor: '#1a1a1a', borderColor: '#333', borderWidth: 1, borderRadius: 8, marginBottom: 10, width: '100%', justifyContent: 'center', height: 50 },
  picker: { color: '#fff' },
  button: { backgroundColor: '#00BFFF', padding: 14, borderRadius: 10, width: '100%', marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  
  // --- NOVOS ESTILOS ---
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  loadingText: {
    color: '#ccc',
    marginLeft: 10,
    fontSize: 16,
  },
});