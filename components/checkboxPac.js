import Checkbox from 'expo-checkbox';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function CheckboxGroupPac({ options, onSelectOption, multipleSelectOption = false }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const defaultSelectedOptions = options.filter((option) => option.defaultValue);
    setSelectedOptions(defaultSelectedOptions.map((option) => option.value));
  }, [options]);

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
    <View style={styles.container}>
      {options.map((option) => (
        <View style={styles.checkboxContainer}>
          <MaterialCommunityIcons name="pill" size={24} color="black" />
          <CustomCheckbox
            key={option.value}
            isChecked={selectedOptions.includes(option.value)}
            defaultValue={option.defaultValue}
            onChange={() => handleOptions(option.value)}
          >
            {option.label}
          </CustomCheckbox>
        </View>
        
      ))}
    </View>
  );
}

function CustomCheckbox({ children, isChecked, onChange, defaultValue }) {
  const checkboxValue = isChecked !== undefined ? isChecked : defaultValue || false;

  return (
    <View style={styles.optionContainer}>
      <Checkbox style={styles.checkbox} value={checkboxValue} onValueChange={onChange} />
      <Text style={styles.optionText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    marginLeft: 8,
  },
  checkbox: {
    margin: 8,
  },
  checkboxContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  }
});
