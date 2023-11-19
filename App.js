import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';

import Cadastro from './screens/Cadastro';
import Login from './screens/Login';
import Painel from './screens/Painel';
import TelaCarregamento from './screens/Carregamento';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false 
            }}
          />
          <Stack.Screen
            name="Carregamento"
            component={TelaCarregamento}
            options={{
              headerShown: false 
            }}
          />
          <Stack.Screen
            name="Cadastro"
            component={Cadastro}
            options={{
              title: 'Cadastro',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="Painel"
            component={Painel}
            options={{
              title: 'Painel',
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
