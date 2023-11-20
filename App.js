import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';

import Cadastro from './screens/Cadastro';
import Login from './screens/Login';
import PainelMedico from './screens/Painel';
import TelaCarregamento from './screens/Carregamento';
import PainelPaciente from './screens/PainelPac';

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
            name="Painel Médico"
            component={PainelMedico}
            options={{
              title: 'Painel Médico',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="Painel Paciente"
            component={PainelPaciente}
            options={{
              title: 'Painel Paciente',
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
