import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Ala = {
  id?: number;
  nome: string;
};

export default function CadastroAla() {
  const [ala, setAla] = useState<Ala>({ nome: '' });
  const [alas, setAlas] = useState<Ala[]>([]);

  useEffect(() => {
    carregarAlas();
  }, []);

  // Função para carregar a lista de alas
  const carregarAlas = async () => {
    try {
      const res = await fetch('http://10.0.2.2:8080/alas'); // URL da API para listar as alas
      const data = await res.json();
      setAlas(data.content || data); // Armazena as alas na lista
    } catch (err) {
      console.error('Erro ao carregar alas', err);
    }
  };

  // Função para cadastrar nova Ala
  const handleCadastroAla = async () => {
    if (!ala.nome) {
      Alert.alert('Atenção', 'Preencha o nome da Ala!');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8080/alas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ala), // Envia os dados de ala para a API
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Ala cadastrada com sucesso!');
        carregarAlas(); // Atualiza a lista de alas
        setAla({ nome: '' }); // Limpa os campos
      } else {
        Alert.alert('Erro', 'Erro ao cadastrar a Ala');
      }
    } catch (error) {
      console.error('Erro ao cadastrar a ala:', error);
      Alert.alert('Erro', 'Erro ao cadastrar a ala. Tente novamente.');
    }
  };

  const limparCampos = () => {
    setAla({ nome: '' });
  };

  // Função para excluir Ala
  const excluirAla = async (id?: number) => {
    if (!id) return;

    try {
      const response = await fetch(`http://10.0.2.2:8080/alas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Ala excluída com sucesso!');
        const novaLista = alas.filter((ala) => ala.id !== id);
        setAlas(novaLista);
      } else {
        Alert.alert('Erro', 'Erro ao excluir a Ala');
      }
    } catch (error) {
      console.error('Erro ao excluir ala:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>📋 Cadastro de Ala</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome da Ala"
        placeholderTextColor="#ccc"
        value={ala.nome}
        onChangeText={(value) => setAla({ nome: value })}
      />

      <TouchableOpacity onPress={handleCadastroAla} style={styles.botao}>
        <Text style={styles.textoBotao}>Cadastrar Ala</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={limparCampos} style={styles.clearButton}>
        <MaterialIcons name="delete-outline" size={20} color="#fff" />
        <Text style={styles.clearButtonText}>Limpar</Text>
      </TouchableOpacity>

      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>📄 Lista de Alas:</Text>
        {alas.map((alaItem, index) => (
          <View key={alaItem.id ?? index} style={{ marginBottom: 12 }}>
            <Text style={styles.previewText}>Nome: {alaItem.nome}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={{ color: '#fff' }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Excluir Ala', 'Tem certeza que deseja excluir esta ala?', [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Excluir', onPress: () => excluirAla(alaItem.id), style: 'destructive' },
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
  titulo: {
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
  botao: {
    backgroundColor: '#00BFFF',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  textoBotao: {
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
