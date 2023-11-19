import React, { useEffect, useState, useContext } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { AuthContext } from "../context/AuthContext.js";

export default function TelaCarregamento ({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const { usertype } = useContext(AuthContext);

  useEffect(() => {
    const simulateLoading = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsLoading(false);
    };

    simulateLoading();

    if (!isLoading) {
      if (usertype === 'medico') {
        navigation.navigate('Painel');
      } else if (usertype === 'paciente') {
        navigation.navigate('Painel2');
      } else {
        console.warn('Tipo de usuário desconhecido! Redirecionando...');
      }
    }
  }, [isLoading, usertype, navigation]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : null }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
