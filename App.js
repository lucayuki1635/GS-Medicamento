import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';

import Cadastro from './screens/Cadastro';
import Login from './screens/Login';
import PainelMedico from './screens/Painel';
import TelaCarregamento from './screens/Carregamento';
import PainelPaciente from './screens/PainelPac';
import BotaoRetorno from './components/returnButton';
import Notificacao from './components/notification';

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
              headerTitleAlign: 'center',
              headerShown: true,
              headerLeft: () =>(
                <BotaoRetorno/>
              ),
              
            }}
          />
          <Stack.Screen
            name="Painel Médico"
            component={PainelMedico}
            options={{
              title: 'Painel Médico',
              headerTitleAlign: 'center',
              headerShown: true,
              headerLeft: () =>(
                <BotaoRetorno/>
                
              ),
            }}
          />
          <Stack.Screen
            name="Painel Paciente"
            component={PainelPaciente}
            options={{
              title: 'Painel Paciente',
              headerTitleAlign: 'center',
              headerTitleAlign: 'center',
              headerShown: true,
              headerLeft: () =>(
                <BotaoRetorno/>
                
              ),
              headerRight: () =>(
                <Notificacao/>
              ),
            }}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
