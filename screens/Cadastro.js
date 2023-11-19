import { StyleSheet, Text, View } from "react-native";
import Button from "../components/button";
import Input from "../components/input";
import CheckboxGroup from "../components/checkbox";
import CustomModal from "../components/modal";
import React, { useState } from 'react';
import axios from "axios"

export default function Cadastro({navigation}){
	const [nome, setNome] = useState('')
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [telefone, setTelefone] = useState('')
	const [especialidade, setEspecialidade] = useState('')
	const [crm, setCRM] = useState('')
	const [idade, setIdade] = useState('')
	const [plano, setPlano] = useState('')
	const [erro, setErro] = useState('')

    const [opcaoSelecionada, setopcaoSelecionada] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);

    const handleSelectOption = (optionValue) => {
        setopcaoSelecionada(optionValue);
    };

	const returnToLogin = () => {
		navigation.navigate('Login');
	};

	function getNumSemana() {
		var dataAtual = new Date();
		var dataInicial = new Date(dataAtual.getFullYear(), 0, 1);
		var dias = Math.floor((dataAtual - dataInicial) /
			(24 * 60 * 60 * 1000));
		
		var numSemana = Math.ceil(dias / 7);  
		return numSemana
	}
	

	async function handleRegister(){
		const tipo = opcaoSelecionada

		const response = await axios.get(`http://localhost:3000/usuarios?email=${email}`);
    	const usuarioExistente = response.data.length > 0;

    	if (usuarioExistente) {
      		setErro("Este e-mail já está registrado.");
    	} else {

			if (opcaoSelecionada=='medico'){
				const data = {nome,crm,especialidade,telefone,email,senha, tipo}
				const verificarVazio =  Object.values(data).every(valor => valor !== '')

				if (!verificarVazio){
					setErro("Complete todos os campos.")
				} else {
					axios.post("http://localhost:3000/usuarios", data) .then(response => {
						setModalVisible(true);
					})
					.catch(error => {
						setErro("Erro ao cadastrar")
					});

				}

			}else if (opcaoSelecionada=='paciente'){
				const medicamentos = {
					"segunda": {},
					"terca": {},
					"quarta": {},
					"quinta": {},
					"sexta": {},
					"sabado": {},
					"domingo": {},
					"week": getNumSemana()
				}
				const notificacoes = []
				const data = {nome,idade,plano,telefone,email,senha,notificacoes,medicamentos,tipo}
				const verificarVazio =  Object.values(data).every(valor => valor !== '')

				if (!verificarVazio){
					setErro("Complete todos os campos.")
				} else {
					axios.post("http://localhost:3000/usuarios", data) .then(response => {
						setModalVisible(true);
					})
					.catch(error => {
						setErro("Erro ao cadastrar")
					});
					
				}
			}
		}
		
	}

    const renderInputsBasedOnOption = () => {
        switch (opcaoSelecionada) {
          case 'medico':
            return (
              <>
                <Input placeholder='Nome' value={nome} onChangeText={setNome}/>
                <Input placeholder='CRM' value={crm} onChangeText={setCRM}/>
                <Input placeholder='Especialidade' value={especialidade} onChangeText={setEspecialidade}/>
				<Input placeholder='Telefone' value={telefone} onChangeText={setTelefone}/>
                <Input placeholder='Email' value={email} onChangeText={setEmail}/>
                <Input placeholder='Senha' value={senha} onChangeText={setSenha} secureTextEntry/>
				<Button onPress={handleRegister}>Registrar-se</Button>
              </>
            );
          case 'paciente':
            return (
              <>
                <Input placeholder='Nome' value={nome} onChangeText={setNome}/>
                <Input placeholder='Idade' value={idade} onChangeText={setIdade}/>
                <Input placeholder='Número do Plano de Saúde' value={plano} onChangeText={setPlano}/>
                <Input placeholder='Telefone' value={telefone} onChangeText={setTelefone}/>
                <Input placeholder='Email' value={email} onChangeText={setEmail}/>
                <Input placeholder='Senha' value={senha} onChangeText={setSenha} secureTextEntry/>
				<Button onPress={handleRegister}>Registrar-se</Button>
              </>
            );
          default:
            return null;
        }
      };

    return(
        <View style={styles.container}>

                <Text style={styles.title}>Registre-se</Text>
				<Text>Tipo de usuário:</Text>
                <CheckboxGroup options={[
                        { label: 'Médico', value: 'medico' },
                        { label: 'Paciente', value: 'paciente' },
                    ]}
                    onSelectOption={handleSelectOption}
                    />
				{renderInputsBasedOnOption()}

				<Text>{erro}</Text>

				<CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} action={returnToLogin}>
				{nome} registrado(a) com sucesso!
				</CustomModal>

        </View>
    )

}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FCFBFF',
      alignItems: 'center',
      justifyContent: 'center',
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
	title:{
		fontSize:30,
		marginBottom: 10,
	}
    
});