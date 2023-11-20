import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'

export default function BotaoRetorno(){
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Login')
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginLeft: 10 }}>
      <FontAwesome5 name="arrow-alt-circle-left" size={24} color="#000" />
    </TouchableOpacity>
  );
};

