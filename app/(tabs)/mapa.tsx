import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useThemedStyles } from '../../src/context/ThemeContext';

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
  const styles = useThemedStyles(createStyles);

  const renderItem = ({ item }: { item: string }) => {
    const borderColor = selectedOption === 'MANUTENCAO' ? styles.successBorder : styles.errorBorder;

    return (
      <View style={[styles.box, borderColor]}>
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

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
  },
  picker: {
    height: 50,
    width: '100%',
    color: colors.text,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 10,
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
    backgroundColor: colors.surface,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  successBorder: {
    borderColor: colors.success,
  },
  errorBorder: {
    borderColor: colors.error,
  },
});

export default Mapa;
