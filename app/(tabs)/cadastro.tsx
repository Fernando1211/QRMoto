import React, { useEffect, useState, useCallback } from 'react';
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
  id_tag?: string; // <- novo campo
};

type Ala = {
  id: number;
  nome: string;
};

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
    id_tag: '',
  });

  const [alas, setAlas] = useState<Ala[]>([]);
  const [listaMotos, setListaMotos] = useState<Moto[]>([]);
  const [ultimaMoto, setUltimaMoto] = useState<Moto | null>(null);

  useEffect(() => {
    listarMotos();
    carregarUltimaMoto();
    carregarAlas();
  }, []);

  const listarMotos = useCallback(async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/motos');
      const data = await response.json();
      const motos = data.content || data;
      setListaMotos(motos);
      await AsyncStorage.setItem('listaMotos', JSON.stringify(motos));
    } catch (error) {
      console.error('Erro ao buscar motos:', error);
    }
  }, []);

  const carregarUltimaMoto = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem('ultimaMoto');
      if (json) setUltimaMoto(JSON.parse(json));
    } catch (error) {
      console.error('Erro ao carregar última moto:', error);
    }
  }, []);

  const carregarAlas = async () => {
    try {
      const res = await fetch('http://10.0.2.2:8080/alas');
      const data = await res.json();
      setAlas(data.content || data);
    } catch (err) {
      console.error('Erro ao carregar alas', err);
    }
  };

  const salvarMotosLocal = async (motos: Moto[]) => {
    try {
      await AsyncStorage.setItem('listaMotos', JSON.stringify(motos));
    } catch (error) {
      console.error('Erro ao salvar lista no AsyncStorage', error);
    }
  };

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
      id_tag: '',
    });
  };

  const cadastrarMoto = async () => {
    try {
      // gera id_tag automático
      const motoComIdTag = { 
        ...moto, 
        id_tag: moto.id_tag || Date.now().toString(),
        ala: { id: moto.alaId }
      };

      const response = await fetch('http://10.0.2.2:8080/motos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(motoComIdTag),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Moto cadastrada com sucesso!');
        await AsyncStorage.setItem('ultimaMoto', JSON.stringify(motoComIdTag));
        setUltimaMoto(motoComIdTag);
        limparCampos();
        listarMotos();
      } else {
        Alert.alert('Erro', 'Erro ao cadastrar a moto');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro na requisição');
      console.error(error);
    }
  };

  const editarMoto = async (motoEditada: Moto) => {
    if (!motoEditada.id) {
      Alert.alert('Erro', 'Moto não possui ID para edição.');
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:8080/motos/${motoEditada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...motoEditada,
          ala: { id: motoEditada.alaId },
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Moto editada com sucesso!');
        const novaLista = listaMotos.map((m) =>
          m.id === motoEditada.id ? motoEditada : m
        );
        setListaMotos(novaLista);
        await salvarMotosLocal(novaLista);
        limparCampos();
      } else {
        Alert.alert('Erro', 'Erro ao editar a moto');
      }
    } catch (error) {
      console.error('Erro ao editar moto:', error);
    }
  };

  const excluirMoto = async (id?: number) => {
    if (!id) return;

    try {
      const response = await fetch(`http://10.0.2.2:8080/motos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Moto excluída com sucesso!');
        const novaLista = listaMotos.filter((m) => m.id !== id);
        setListaMotos(novaLista);
        await salvarMotosLocal(novaLista);
      } else {
        Alert.alert('Erro', 'Erro ao excluir moto');
      }
    } catch (error) {
      console.error('Erro ao excluir moto:', error);
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
          placeholderTextColor="#ccc"
          value={moto[field]}
          onChangeText={(value) => handleChange(field, value)}
        />
      ))}

      {/* STATUS */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={moto.status}
          onValueChange={(value) => handleChange('status', value)}
          dropdownIconColor="#fff"
          style={styles.picker}
        >
          <Picker.Item label="Selecione o status" value="" />
          {STATUS_OPTIONS.map((status) => (
            <Picker.Item key={status} label={status} value={status} />
          ))}
        </Picker>
      </View>

      {/* ALA */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={moto.alaId}
          onValueChange={(value) => handleChange('alaId', value)}
          dropdownIconColor="#fff"
          style={styles.picker}
        >
          <Picker.Item label="Selecione a Ala" value={undefined} />
          {alas.map((ala) => (
            <Picker.Item key={ala.id} label={ala.nome} value={ala.id} />
          ))}
        </Picker>
      </View>

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

      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>📄 Lista de Motos:</Text>

        {listaMotos.map((m, index) => (
          <View key={m.id ?? index} style={{ marginBottom: 12 }}>
            {CAMPOS_FORM.map((field) => (
              <Text key={field} style={styles.previewText}>
                {`${field[0].toUpperCase() + field.slice(1)}: ${m[field]}`}
              </Text>
            ))}
            <Text style={styles.previewText}>Status: {m.status}</Text>
            <Text style={styles.previewText}>Ala ID: {m.alaId ?? '---'}</Text>
            <Text style={styles.previewText}>ID_TAG: {m.id_tag ?? '---'}</Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <TouchableOpacity onPress={() => setMoto(m)} style={styles.editButton}>
                <Text style={{ color: '#fff' }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Excluir Moto', 'Tem certeza que deseja excluir esta moto?', [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Excluir', onPress: () => excluirMoto(m.id), style: 'destructive' },
                  ])
                }
                style={[styles.editButton, { backgroundColor: '#aa2222' }]}
              >
                <Text style={{ color: '#fff' }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#00BFFF',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#fff',
  },
  pickerContainer: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  picker: {
    color: '#fff',
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#00BFFF',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 15,
  },
  previewBox: {
    marginTop: 25,
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  previewTitle: {
    color: '#00BFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  previewText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 3,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#555',
    borderRadius: 6,
  },
});
