import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const NUM_ROWS = 10;
const NUM_COLUMNS = 4;

const generateLabels = (): string[] => {
  const labels: string[] = [];
  for (let i = 1; i <= NUM_ROWS * NUM_COLUMNS; i++) {
    labels.push(`MD${i.toString().padStart(2, '0')}`);
  }
  return labels;
};

const Mapa: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('MANUTENCAO');
  const labels = generateLabels();

  const renderItem = ({ item }: { item: string }) => {
    const borderColor = selectedOption === 'MANUTENCAO' ? 'green' : 'red';

    return (
      <View style={[styles.box, { borderColor }]}>
        <Text style={styles.text}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedOption}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Manutenção" value="MANUTENCAO" />
        <Picker.Item label="Recuperação" value="RECUPERACAO" />
      </Picker>

      <FlatList
        data={labels}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.grid}
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'black',
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'white',
    backgroundColor: 'black',
    
  },
  grid: {
    alignItems: 'center',
  },
  box: {
    width: Dimensions.get('window').width / NUM_COLUMNS - 20,
    height: 70,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: 'black', // mantém o fundo neutro
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Mapa;
