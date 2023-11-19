import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, Picker, TouchableOpacity } from 'react-native';
import { AuthContext } from "../context/AuthContext.js";
import axios from "axios";
import CustomModal from "../components/modal";

export default function Painel() {
    const { username, usertype } = useContext(AuthContext);
    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [selectedPatientData, setSelectedPatientData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [infoDay, setDay] = useState('');

    useEffect(() => {
        axios.get("http://localhost:3000/usuarios")
            .then(resp => setPacientes(resp.data))
    }, []);

    useEffect(() => {
        if (selectedPaciente !== '') {
            const patientData = pacientes[selectedPaciente - 1];
            setSelectedPatientData(patientData);
        } else {
            setSelectedPatientData(null);
        }
    }, [selectedPaciente, pacientes]);

    const renderMedicationButtons = () => {
        const daysOfWeek = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
        const daysOfWeekPT = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    
        return (
            <View style={styles.table}>
                {daysOfWeek.map((day, index) => (
                    <View key={day} style={styles.table_body_single_row}>
                        <View style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.dayOfWeekText}>
                                {daysOfWeekPT[index]}:
                            </Text>
                        </View>
                        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.buttonStyle('green')}>
                                <Text>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.buttonStyle('red')}>
                                <Text>Remover</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={styles.buttonStyle('blue')}
                                onPress={() => handleMedicationButtonClick(day)}
                            >
                                <Text>Ver</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        );
    };
    

    const renderPatientDetails = () => {
        if (selectedPatientData) {
            return (
                <View style={styles.patientDetailsContainer}>
                    <View style={styles.centeredTextContainer}>
                        <Text style={styles.centeredText}>
                            Nome: {selectedPatientData.nome} | Idade: {selectedPatientData.idade}
                        </Text>
                        <Text style={styles.centeredText}>Telefone: {selectedPatientData.telefone}</Text>
                    </View>
                    <View style={styles.centeredTextContainer}>
                        <Text style={styles.centeredText}>Medicamentos</Text>
                    </View>
                    {renderMedicationButtons()}
                    <TouchableOpacity style={styles.buttonStyle('orange')}>
                        <Text style={{ textAlign: 'center' }}>Enviar notificação</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    const handleMedicationButtonClick = (day) => {
    const medications = selectedPatientData.medicamentos[day];

    if (medications && Object.keys(medications).length > 0) {
        const medicationsText = Object.entries(medications)
            .map(([medication, details]) => {
                const [taken, horarioIndicado, horarioTomado] = details;
                const statusText = taken ? '✔️' : '✖️';
                const horarioTomadoText = taken ? `, HT: ${horarioTomado}` : '';
                return `${medication} ${statusText} - HI: ${horarioIndicado}${horarioTomadoText}`;
            })
            .join('\n');

        setDay(`Medicamentos registrados: \n${medicationsText}`);
    } else {
        setDay(`Não há medicamentos registrados!`);
    }
    setModalVisible(true);
};


    console.log(infoDay)

    return (
        <View style={styles.containerBetween}>
            <View style={styles.header}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedPaciente}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedPaciente(itemValue)
                        }
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecione um paciente" value={null} />
                        {pacientes
                            .filter(paciente => paciente.tipo === 'paciente')
                            .map(paciente => (
                                <Picker.Item
                                    key={paciente.id}
                                    label={paciente.nome}
                                    value={paciente.id}
                                />
                            ))}
                    </Picker>
                </View>
            </View>
            {renderPatientDetails()}
            <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)}>
				{infoDay}
			</CustomModal>
        </View>
    );
}

const styles = StyleSheet.create({
    containerBetween: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      padding: 10,
    },
    header: {

      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,

    },
    pickerContainer: {
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,


    },
    picker: {
      height: 50,

    },
    buttonStyle: (color) => ({
      backgroundColor: color,
      padding: 5,
      borderRadius: 5,
    }),
    centeredTextContainer: {
      marginTop: 10,
      alignItems: 'center',

    },
    centeredText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,

    },
    sendNotificationButton: {
      marginTop: 10,
      backgroundColor: 'orange',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',

    },
    patientDetailsContainer: {
      marginTop: 20,
      width: '100%',
    },
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      width: '100%',
    },
    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      backgroundColor: '#3bcd6b',
      width: '100%',
    },
    table_head_captions: {
      fontSize: 15,
      color: 'white',
      width: '100%',
    },
    table_body_single_row: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      width: '100%',
    },
    table_data: {
      fontSize: 11,
      width: '100%',
    },
    table: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
        backgroundColor: '#fff',
      },
      
  });
  
