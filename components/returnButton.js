import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BotaoRetorno = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginLeft: 10 }}>
      <Text>Voltar</Text>
    </TouchableOpacity>
  );
};

export default BotaoRetorno;