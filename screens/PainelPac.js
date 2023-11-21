import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, Picker, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from "../context/AuthContext.js";
import axios from "axios";
import CheckboxGroupPac from "../components/checkboxPac.js";
import { FontAwesome5 } from '@expo/vector-icons'
import CustomModal from "../components/modal.js";

export default function PainelPaciente() {
    const { userId, notificationCount} = useContext(AuthContext);
    const weekdayTitle = ["Segunda", "Terça", "Quarta", "Quinta","Sexta" ,"Sábado", "Domingo"];
    const weekdays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    const [pacientes, setPacientes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [modalVisible, setModalVisible] = useState(true);
    const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
    const [notifications,setNotificationCount]=useState(0);
    var temp = []


    const fetchData = () => {
        axios.get(`http://localhost:3000/usuarios/${userId}`)
          .then(resp => setPacientes(resp.data))
          .catch(error => console.error('Erro ao buscar dados:', error));

    };

    function weekUpdate() {
        var medicamentos = pacientes
		var dataAtual = new Date();
		var dataInicial = new Date(dataAtual.getFullYear(), 0, 1);
		var dias = Math.floor((dataAtual - dataInicial) /
			(24 * 60 * 60 * 1000));
		var numSemana = Math.ceil(dias / 7);  
		if(pacientes['medicamentos']["week"] != numSemana) {
            for (const diaSemana in medicamentos['medicamentos']) {
                if (typeof medicamentos['medicamentos'][diaSemana] === 'object' && medicamentos['medicamentos'][diaSemana] !== null) {
                  for (const chaveInterna in medicamentos['medicamentos'][diaSemana]) {
                    if (Array.isArray(medicamentos['medicamentos'][diaSemana][chaveInterna]) && typeof medicamentos['medicamentos'][diaSemana][chaveInterna][0] === 'boolean') {
                      medicamentos['medicamentos'][diaSemana][chaveInterna][0] = false;
                    }
                  }
                }
              }

            medicamentos['medicamentos']['week'] = numSemana
            axios.put(`http://localhost:3000/usuarios/${userId}/`, medicamentos).then(response => {
                    console.log('Semana atualizada')
                })
                .catch(error => {
                    console.log('Erro ao atualizar semana')
                });
        }
	}

    useEffect(() => {
        fetchData();
    }, []);

    const handleNextPage = () => {
        setCurrentPage(currentPage === weekdayTitle.length - 1 ? 0 : currentPage + 1);
        fetchData()
        
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage === 0 ? weekdayTitle.length - 1 : currentPage - 1);
        fetchData()
        
    };

    const handleSelectOption = (selectedOptions) => {
        const medicamentos = pacientes['medicamentos'][weekdays[currentPage]] || {};
        Object.entries(medicamentos).forEach(([label, [defaultValue, hi, _]], index) => {
           if(selectedOptions.includes(label)) {
                pacientes["medicamentos"][weekdays[currentPage]][label][0] = true
           }else{
                pacientes["medicamentos"][weekdays[currentPage]][label][0] = false
           }

        });

        axios.put(`http://localhost:3000/usuarios/${userId}/`, pacientes).then(response => {
            console.log('Remedios tomados atualizados')
        })
        .catch(error => {
            console.log('Erro ao atualizar remedios')
        });
        
    };


    function getCheckeds(){
        if (pacientes.length !== 0) {
            const medicamentos = pacientes['medicamentos'][weekdays[currentPage]] || {};
            temp = [];
            Object.entries(medicamentos).forEach(([label, [defaultValue, hi, _]], index) => {
                temp.push({
                    label: `${label} (${hi})`,
                    value: label,
                    defaultValue,
                    onPress: () => handleOpenNotificationModal(index),
                })
            });
            
        }    

    }
    getCheckeds()


    const handleOpenNotificationModal = () => {
        setModalVisible(true);
    };
    

    const handleCloseNotificationModal = () => {
        if (currentNotificationIndex < pacientes["notificacoes"].length - 1) {
            setCurrentNotificationIndex(currentNotificationIndex + 1);
        } else {
            pacientes["notificacoes"].splice(0, currentNotificationIndex+1)
            setModalVisible(false);
            setCurrentNotificationIndex(0);
            axios.put(`http://localhost:3000/usuarios/${userId}/`, pacientes).then(response => {
                    console.log('Notificacoes att')
                })
                .catch(error => {
                    console.log('Erro ao atualizar notificacao')
                });
        }
    };

    if(notificationCount !== notifications) {
        fetchData()
        setNotificationCount(notificationCount)
        handleOpenNotificationModal()
    }

    if (pacientes.length != 0) {
        weekUpdate()
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.navigationContainer}>
                    <TouchableOpacity onPress={handlePrevPage}>
                        <FontAwesome5 name="arrow-alt-circle-left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.pageTitle}>{weekdayTitle[currentPage]}</Text>
                    <TouchableOpacity onPress={handleNextPage}>
                        <FontAwesome5 name="arrow-alt-circle-right" size={24} color="#000" />
                    </TouchableOpacity>
                    </View>

                    {pacientes.length !== 0 ? (
                            <>
                                {temp.length !== 0 ? (
                                    <CheckboxGroupPac
                                        options={temp}
                                        onSelectOption={handleSelectOption}
                                        multipleSelectOption={true}
                                    />
                                ) : (

                                        <Text style={styles.centeredText}>
                                            Não há medicamentos registrados para este dia.
                                        </Text>

                                )}

                                {pacientes["notificacoes"].length !== 0 ? (
                                    <CustomModal
                                        visible={modalVisible}
                                        onClose={handleCloseNotificationModal}
                                    >
                                        <Text>{pacientes["notificacoes"][currentNotificationIndex]}</Text>
                                    </CustomModal>
                                ) : (
                                    <CustomModal
                                        visible={modalVisible}
                                        onClose={handleCloseNotificationModal}
                                    >
                                        <Text>Não há notificações</Text>
                                    </CustomModal>
                                )}
                            </>
                        ) : (
                            <Text>Carregando...</Text>
                    )}
                    </View>
                </ScrollView>
    );
}

const styles = StyleSheet.create({
    navigationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    arrow: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    pageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        marginRight: 20,
    },
    centeredText: {
        textAlign: 'center',
        marginTop:20
    },
});
