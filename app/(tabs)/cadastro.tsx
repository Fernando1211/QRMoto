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
        Alert.alert('Aviso', 'Nenhuma ala cadastrada. Cadastre uma ala primeiro.');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar alas:', error);
      Alert.alert(
        'Erro ao Carregar Alas', 
        'Não foi possível carregar as alas. Verifique:\n\n' +
        '1. Se o backend está rodando\n' +
        '2. Se a URL está correta\n' +
        '3. Se existe o endpoint /api/alas'
      );
      
      // Tenta carregar do cache
      try {
        const cached = await AsyncStorage.getItem('alas');
        if (cached) {
          const cachedAlas = JSON.parse(cached);
          setAlas(cachedAlas);
          Alert.alert('Cache', `${cachedAlas.length} ala(s) carregada(s) do cache`);
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
      Alert.alert('Erro', 'O campo Modelo é obrigatório');
      return false;
    }
    if (!moto.placa.trim()) {
      Alert.alert('Erro', 'O campo Placa é obrigatório');
      return false;
    }
    if (!moto.status) {
      Alert.alert('Erro', 'Selecione um Status');
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
        
        Alert.alert('Sucesso', 'Moto cadastrada com sucesso!');
        limparCampos();
        await listarMotos();
      } else {
        const text = await response.text();
        console.error('Erro ao cadastrar:', text);
        Alert.alert('Erro', `Erro ao cadastrar a moto: ${text}`);
      }
    } catch (error) {
      console.error('❌ Erro ao cadastrar moto:', error);
      Alert.alert('Erro', 'Erro na requisição. Verifique sua conexão.');
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
        Alert.alert('Sucesso', 'Moto editada com sucesso!');
        await listarMotos();
        limparCampos();
      } else {
        const text = await response.text();
        Alert.alert('Erro', `Erro ao editar a moto: ${text}`);
      }
    } catch (error) {
      console.error('❌ Erro ao editar moto:', error);
      Alert.alert('Erro', 'Erro na requisição. Verifique sua conexão.');
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
        Alert.alert('Sucesso', 'Moto excluída com sucesso!');
        await listarMotos();
      } else {
        const text = await response.text();
        Alert.alert('Erro', `Erro ao excluir moto: ${text}`);
      }
    } catch (error) {
      console.error('❌ Erro ao excluir moto:', error);
      Alert.alert('Erro', 'Erro na requisição. Verifique sua conexão.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Cadastro de Moto</Text>

      {CAMPOS_FORM.map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={`Digite ${field}`}
          placeholderTextColor="#999"
          value={moto[field]}
          onChangeText={(value) => handleChange(field, value)}
        />
      ))}

      {/* STATUS */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={moto.status}
          onValueChange={(value) => handleChange('status', value)}
          dropdownIconColor="#00BFFF"
          style={styles.picker}
        >
          <Picker.Item label="Selecione o status" value="" color="#999" />
          {STATUS_OPTIONS.map((status) => (
            <Picker.Item key={status} label={status} value={status} />
          ))}
        </Picker>
      </View>

      {/* ALA */}
      <View style={styles.pickerContainer}>
        {loadingAlas ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#00BFFF" />
            <Text style={styles.loadingText}>Carregando alas...</Text>
          </View>
        ) : (
          <Picker
            selectedValue={moto.alaId}
            onValueChange={(value) => handleChange('alaId', value)}
            dropdownIconColor="#00BFFF"
            style={styles.picker}
          >
            <Picker.Item label="Selecione a Ala (opcional)" value={undefined} color="#999" />
            {alas.map((ala) => (
              <Picker.Item key={ala.id} label={ala.nome} value={ala.id} />
            ))}
          </Picker>
        )}
      </View>

      {/* Aviso se não houver alas */}
      {alas.length === 0 && !loadingAlas && (
        <View style={styles.warningBox}>
          <MaterialIcons name="warning" size={20} color="#FFA500" />
          <Text style={styles.warningText}>Nenhuma ala cadastrada</Text>
        </View>
      )}

      {/* Mostra quantas alas foram carregadas */}
      {alas.length > 0 && (
        <Text style={styles.infoText}>✅ {alas.length} ala(s) disponível(is)</Text>
      )}

      {/* Botão para recarregar alas */}
      <TouchableOpacity
        onPress={() => carregarAlas()}
        style={styles.refreshButton}
        disabled={loadingAlas}
      >
        <MaterialIcons name="refresh" size={18} color="#fff" />
        <Text style={styles.refreshButtonText}>
          {loadingAlas ? 'Carregando...' : 'Recarregar Alas'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={moto.id ? () => editarMoto(moto) : cadastrarMoto}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {moto.id ? 'Salvar Alterações' : 'Cadastrar Moto'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={limparCampos} style={styles.clearButton}>
        <MaterialIcons name="delete-outline" size={20} color="#fff" />
        <Text style={styles.clearButtonText}>Limpar</Text>
      </TouchableOpacity>

      {loadingMotos ? (
        <ActivityIndicator size="large" color="#00BFFF" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle}>📄 Lista de Motos ({listaMotos.length}):</Text>

          {listaMotos.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma moto cadastrada</Text>
          ) : (
            listaMotos.map((m, index) => (
              <View key={m.id ?? index} style={styles.motoCard}>
                {CAMPOS_FORM.map((field) => (
                  <Text key={field} style={styles.previewText}>
                    {`${field[0].toUpperCase() + field.slice(1)}: ${m[field] || '---'}`}
                  </Text>
                ))}
                <Text style={styles.previewText}>Status: {m.status}</Text>

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
                    <MaterialIcons name="edit" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert('Excluir Moto', 'Tem certeza que deseja excluir esta moto?', [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Excluir', onPress: () => excluirMoto(m.id), style: 'destructive' },
                      ])
                    }
                    style={styles.deleteButton}
                  >
                    <MaterialIcons name="delete" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Excluir</Text>
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#00BFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
    borderRadius: 8,
    fontSize: 15,
    color: '#fff',
  },
  pickerContainer: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  picker: {
    color: '#fff',
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  loadingText: {
    color: '#999',
    marginLeft: 8,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#332200',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    gap: 8,
  },
  warningText: {
    color: '#FFA500',
    fontSize: 13,
  },
  infoText: {
    color: '#4CAF50',
    fontSize: 13,
    marginBottom: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#00BFFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewBox: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
  },
  previewTitle: {
    fontSize: 18,
    color: '#00BFFF',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  motoCard: {
    backgroundColor: '#0a0a0a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#222',
    borderWidth: 1,
  },
  previewText: {
    color: '#ddd',
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
    backgroundColor: '#0066cc',
    padding: 8,
    borderRadius: 6,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cc2222',
    padding: 8,
    borderRadius: 6,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});