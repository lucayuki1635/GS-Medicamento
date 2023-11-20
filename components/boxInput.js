import { StyleSheet, TextInput } from "react-native";

export default function BoxInput({...props}){
    return(
        <TextInput style={styles.input} multiline={true} numberOfLines={4} {...props}/>
    )
}


const styles = StyleSheet.create({
    input: {
        backgroundColor: '#FFF',
        borderColor: 'gray',
        borderWidth: 1,
        padding: 20,
        borderRadius: 4,
        marginTop: 16,
      },
});