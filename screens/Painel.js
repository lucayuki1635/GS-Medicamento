import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, Text, View, StyleSheet, Picker } from 'react-native';
import Button from '../components/button.js';
import { AuthContext } from "../context/AuthContext.js";
import axios from "axios";

export default function Painel() {
    const { username, usertype } = useContext(AuthContext);
    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');

    useEffect(() => {
        axios.get("http://localhost:3000/usuarios")
            .then(resp => setPacientes(resp.data))
    }, []);

    return (
        <View style={styles.containerBetween}>
            <View style={styles.header}>
                {usertype === 'medico' && (
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedPaciente}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedPaciente(itemValue)
                            }
                            style={styles.picker}
                        >
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
                )}
            </View>
            <Button>finalizar</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    pickerContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        width: 200,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    containerBetween: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    }
});
