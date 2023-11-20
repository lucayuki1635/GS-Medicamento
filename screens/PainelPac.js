import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, Picker, TouchableOpacity } from 'react-native';
import { AuthContext } from "../context/AuthContext.js";
import axios from "axios";
import CustomModal from "../components/modal";

export default function PainelPaciente() {
    const { pacienteID } = useContext(AuthContext)
    const weekday = ["domingo","segunda","terca","quarta","quinta","sexta","sabado"];
    const d = new Date();
    let day = weekday[d.getDay()];
    
    async function getUserData(){
		const response = await axios.get(`http://localhost:3000/usuarios?id=${pacienteID}`);
        return response.data
    }
    console.log(getUserData())


    return(
        <Text></Text>
        )
}