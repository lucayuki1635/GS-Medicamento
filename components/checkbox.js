import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CheckboxGroup({ options, onSelectOption, multipleSelectOption = false, position = 'h' }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptions = (checkboxValue) => {
    if (multipleSelectOption) {
      const updatedOptions = selectedOptions.includes(checkboxValue)
        ? selectedOptions.filter((value) => value !== checkboxValue)
        : [...selectedOptions, checkboxValue];

      setSelectedOptions(updatedOptions);
      onSelectOption(updatedOptions);
    } else {
      const updatedOption = checkboxValue === selectedOptions[0] ? null : checkboxValue;
      setSelectedOptions([updatedOption]);
      onSelectOption(updatedOption);
    }
  };

  return (
    <View style={position === 'v' ? styles.verticalContainer : styles.horizontalContainer}>
      {options.map((option) => (
        <CustomCheckbox
          key={option.value}
          isChecked={selectedOptions.includes(option.value)}
          onChange={() => handleOptions(option.value)}
        >
          {option.label}
        </CustomCheckbox>
      ))}
    </View>
  );
}

function CustomCheckbox({ children, isChecked, onChange }) {
  return (
    <View style={styles.checkboxContainer}>
      <Checkbox style={styles.checkbox} value={isChecked} onValueChange={onChange} />
      <Text style={styles.paragraph}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16, // Ajuste de espaçamento horizontal entre as opções
    marginBottom: 2,  // Ajuste de espaçamento vertical entre as opções
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
