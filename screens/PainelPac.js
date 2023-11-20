import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, Picker, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from "../context/AuthContext.js";
import axios from "axios";
import CheckboxGroupPac from "../components/checkboxPac.js";
import { FontAwesome5 } from '@expo/vector-icons'
import CustomModal from "../components/modal.js";

export default function PainelPaciente() {
    const { userId, notificationCount} = useContext(AuthContext);
    const weekdayTitle = ["Segunda", "Terça", "Quarta", "Quinta", "Sábado", "Domingo"];
    const weekdays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    const [pacientes, setPacientes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [modalVisible, setModalVisible] = useState(true);
    const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
    const [notifications,setNotificationCount]=useState(0);
    var temp = []
    var mensagem = ''


    const fetchData = () => {
        
        axios.get(`http://localhost:3000/usuarios/${userId}`)
          .then(resp => setPacientes(resp.data))
          .catch(error => console.error('Erro ao buscar dados:', error));

          console.log("Atualizado")
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleNextPage = () => {
        setCurrentPage(currentPage === weekdayTitle.length - 1 ? 0 : currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage === 0 ? weekdayTitle.length - 1 : currentPage - 1);
    };

    const handleSelectOption = (selectedOptions) => {
        console.log(selectedOptions);
    };


    if (pacientes.length !== 0) {
        const medicamentos = pacientes['medicamentos'][weekdays[currentPage]] || {};
        temp = [];

        Object.entries(medicamentos).forEach(([label, [defaultValue, hi, _]], index) => {
            temp.push({
                label: `${label} (${hi})`,
                value: label,
                defaultValue,
                onPress: () => handleOpenNotificationModal(index),
            });
        });
    }


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
        }
    };

    if(notificationCount !== notifications) {
        setNotificationCount(notificationCount)
        handleOpenNotificationModal()
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

                    {pacientes.length !== 0 && (
                        <>
                            <CheckboxGroupPac
                                options={temp}
                                onSelectOption={handleSelectOption}
                                multipleSelectOption={true}
                            />
                            
                            {pacientes["notificacoes"].length != 0 ? (
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
});
