import { StatusBar } from 'expo-status-bar';
import {Image, StyleSheet, Text, Pressable, View } from 'react-native';
import Button from '../components/button';
import Input from '../components/input';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';


export default function Login({navigation}) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const {login} = useContext(AuthContext)
  
  
  function teste(){
    console.log("Tipo de usuário:", usertype);
  }

  async function handleLogin(){
    if (await login({email, senha})){
      navigation.navigate('Carregamento')
    }else{
      setErro("Usuário ou senha inválidos")
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/home.jpg')}/>
      <Text>Sistema</Text>
      <Text style={styles.title}>Acompanhamento de Paciente</Text>
      <Input placeholder='email' value={email} onChangeText={setEmail}/>
      <Input placeholder='senha' value={senha} onChangeText={setSenha} secureTextEntry/>

      <Button onPress={handleLogin}>Entrar </Button>

      <Text>{erro}</Text>
      
      <Pressable>
        <Text onPress={() => navigation.navigate("Cadastro")}>criar conta</Text>
      </Pressable>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    color:'#121A2C',
    fontSize: 20,
    fontWeight: 'bold',
  },
   
  image: {
    height: 200,
    width: '100%',
    position: 'absolute',
    top: 0,
  }
});
