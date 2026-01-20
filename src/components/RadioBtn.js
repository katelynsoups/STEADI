
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";

const Radio = ({options, checkedValue, onChange, style}) => {
    return(<View style = {[styles.container, style]}>
        {options.map((option) =>{
            let active = checkedValue == option.value;

            return(
            <TouchableOpacity style={active? [styles.radio, styles.activeRadio] : styles.radio}
            onPress={() => onChange(option.value)}
            key= {option.value}>
                <MaterialIcons name = {active? "radio-button-checked" : "radio-button-unchecked"} size = {24} color = { active? "#414040" : "#a6a6a6"}/>
                <Text style = {styles.text}>{option.label}</Text>
            </TouchableOpacity>)
        }
        )}
    </View>)
} 

const styles =  StyleSheet.create({
    container: {
        width: "100%",
    },
    radio: {
        height: 60,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        paddingHorizontal:15,
        borderRadius: 15,
        backgroundColor: "#f3f4f6",
    },
    activeRadio: {
        backgroundColor: "#393a3a" + "11",
    },
    text: {
        fontSize: 17,
        marginLeft: 15,
        color: "#252525",
    },
    activeText: {
        color: "#171717"
    }
    

})
export default Radio;