import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, Picker, TouchableOpacity } from 'react-native';
import { AuthContext } from "../context/AuthContext.js";
import axios from "axios";
import CustomModal from "../components/modal";
import Input from '../components/input';
import CheckboxGroup from "../components/checkbox";
import BoxInput from '../components/boxInput.js';

export default function PainelMedico() {
    const { username, usertype, userID } = useContext(AuthContext);
    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [selectedPatientData, setSelectedPatientData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
    const [modalVisibleRmv, setModalVisibleRmv] = useState(false);
    const [modalVisibleInfo, setModalVisibleInfo] = useState(false);
    const [modalVisibleNot, setModalVisibleNot] = useState(false);
    const [infoDay, setDay] = useState('');
    const [infoModal, setInfoModal] = useState('');
    const [nomeRemedio, setNomeRemedio] = useState('');
    const [horarioTomar, setHorarioTomar] = useState('');
    const [medicamentosDoDia, setMedicamentosDoDia] = useState([]);
    const [selectedMedicamentos, setSelectedMedicamentos] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const [notificacao, setNotificacao] = useState('');

    const fetchData = () => {
        axios.get("http://localhost:3000/usuarios")
          .then(resp => setPacientes(resp.data))
          .catch(error => console.error('Erro ao buscar dados:', error));

        if (selectedPaciente !== '') {
            const patientData = pacientes[selectedPaciente - 1];
            setSelectedPatientData(patientData);
        } else {
            setSelectedPatientData(null);
        }
      };
    
    useEffect(() => {
    fetchData();
  }, []);
    

    useEffect(() => {
        if (selectedPaciente !== '') {
            const patientData = pacientes[selectedPaciente - 1];
            setSelectedPatientData(patientData);
        } else {
            setSelectedPatientData(null);
        }
    }, [selectedPaciente, pacientes]);

    const handleSelectOption = (selectedOptions) => {
        setSelectedMedicamentos(selectedOptions);
    };

    const handleAddMedication = (day, nomeRemedio, horarioTomar) => {
        if (nomeRemedio != '' && horarioTomar!= '') { 
            var dataUpdate = selectedPatientData
            dataUpdate['medicamentos'][day][nomeRemedio] = [false, horarioTomar, "00:00"]
            axios.put(`http://localhost:3000/usuarios/${selectedPaciente}/`, dataUpdate).then(response => {
                setInfoModal('Medicamento adicionado com sucesso')
                setModalVisibleInfo(true)
                fetchData()
            })
            .catch(error => {
                setInfoModal('Erro ao adicionar medicamento')
                setModalVisibleInfo(true)
            });
        }
    };

    const handleRemoveMedication = (day) => {
        if(selectedMedicamentos.length != 0){
            var dataUpdate = selectedPatientData
            selectedMedicamentos.map((medicamento) => {
                delete dataUpdate['medicamentos'][day][medicamento];
    
                return null;
              });
            
            axios.put(`http://localhost:3000/usuarios/${selectedPaciente}/`, dataUpdate).then(response => {
                setInfoModal('Medicamento removido com sucesso')
                setModalVisibleInfo(true)
                fetchData()
              })
              .catch(error => {
                setInfoModal('Erro ao remover medicamento')
                setModalVisibleInfo(true)
              });
        
            setModalVisibleRmv(false);

        }
        
    };

    const handleAddButtonClick = (day) => {
        setModalVisibleAdd(true)
        setSelectedDay(day)
    };
    const handleRemoveButtonClick = (day) => {
        const medications = selectedPatientData.medicamentos[day];
        setSelectedDay(day)
        if (medications && Object.keys(medications).length > 0) {
            const medicationsList = Object.keys(medications)
            setMedicamentosDoDia(medicationsList)
            setModalVisibleRmv(true)
        } else {
            setMedicamentosDoDia([])
            setModalVisibleRmv(true)
        }
    };

    const handleMedicationButtonClick = (day) => {
        fetchData()
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

    const handleSendNotification = () => {
        if (notificacao != '') { 
            var dataUpdate = selectedPatientData
            dataUpdate['notificacoes'].push(`O médico ${username} escreveu uma mensagem: \n${notificacao}`)
            axios.put(`http://localhost:3000/usuarios/${selectedPaciente}/`, dataUpdate).then(response => {
                setInfoModal('Notificação enviada com sucesso')
                setModalVisibleInfo(true)
                fetchData()
            })
            .catch(error => {
                setInfoModal('Erro ao enviar a notificação')
                setModalVisibleInfo(true)
            });
            
        }
        
    };

    function weekUpdate() {
        var medicamentos = selectedPatientData
		var dataAtual = new Date();
		var dataInicial = new Date(dataAtual.getFullYear(), 0, 1);
		var dias = Math.floor((dataAtual - dataInicial) /
			(24 * 60 * 60 * 1000));
		var numSemana = Math.ceil(dias / 7);  
		if(selectedPatientData['medicamentos']["week"] != numSemana) {
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
            axios.put(`http://localhost:3000/usuarios/${selectedPaciente}/`, medicamentos).then(response => {
                    console.log('Semana atualizada')
                })
                .catch(error => {
                    console.log('Erro ao atualizar semana')
                });
        }
	}

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
                            <TouchableOpacity
                                style={styles.buttonStyle('green')}
                                onPress={() => handleAddButtonClick(day)}
                            >
                                <Text>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={styles.buttonStyle('red')}
                                onPress={() => handleRemoveButtonClick(day)}
                            >
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
                    <TouchableOpacity style={styles.buttonStyle('orange')} onPress={() => setModalVisibleNot(true)}>
                        <Text style={{ textAlign: 'center' }}>Enviar notificação</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };


    if (selectedPatientData != null) {
        weekUpdate()
    }

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

            <CustomModal visible={modalVisibleAdd} onClose={() => setModalVisibleAdd(false)} action={() => handleAddMedication(selectedDay, nomeRemedio, horarioTomar)} buttonLabel='Adicionar'>
                <View>
                    <Input
                        placeholder="Nome do Remédio"
                        onChangeText={(text) => setNomeRemedio(text)}
                    />
                    <Input
                        placeholder="Horário para Tomar"
                        onChangeText={(text) => setHorarioTomar(text)}
                    />
                </View>
            </CustomModal>
            
            <CustomModal visible={modalVisibleRmv} onClose={() => setModalVisibleRmv(false)} action={() => handleRemoveMedication(selectedDay)} buttonLabel="Remover">
                {modalVisibleRmv && (
                    <View>
                        {medicamentosDoDia.length > 0 ? (
                            <CheckboxGroup
                                options={medicamentosDoDia.map((medicamento) => ({
                                    label: medicamento,
                                    value: medicamento,
                                }))}
                                selectedOptions={selectedMedicamentos}
                                onSelectOption={handleSelectOption}
                                multipleSelectOption={true}
                                position='v'
                            />
                        ) : (
                            <Text>Não há medicamentos registrados</Text>
                        )}
                    </View>
                    )}
            </CustomModal>

            <CustomModal visible={modalVisibleInfo} onClose={() => setModalVisibleInfo(false)}>
                {infoModal}
            </CustomModal>

            <CustomModal visible={modalVisibleNot} onClose={() => setModalVisibleNot(false)} buttonLabel='Enviar' action={() => handleSendNotification()}>
                <View>
                    <Text>Digite uma mensagem para o paciente: </Text>
                    <BoxInput onChangeText={(text) => setNotificacao(text)}></BoxInput>

                </View>
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
  
