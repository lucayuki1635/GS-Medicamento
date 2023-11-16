import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CheckboxGroup({ options, onSelectOption, multipleSelectOption=false }) {
    const [selectedOptions, setSelectedOptions] = useState([]);


    const handleOptions = (checkboxValue) =>{
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
    

    return(
        <View style={styles.section}>
            {options.map((option) => (
            <CustomCheckbox key={option.value} isChecked={selectedOptions.includes(option.value)} onChange={() => handleOptions(option.value)}>{option.label}</CustomCheckbox>
            ))}

        </View>
    )
};

function CustomCheckbox({ children, isChecked, onChange }){
    return (
        <View style={styles.section}>
          <Checkbox style={styles.checkbox} value={isChecked} onValueChange={onChange} />
          <Text style={styles.paragraph}>{children}</Text>
        </View>
      );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 16,
      marginVertical: 32,
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    paragraph: {
      fontSize: 15,
    },
    checkbox: {
      margin: 8,
    },
});