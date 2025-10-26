import React, { useState } from 'react';
import { styles } from '../styles/styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const SignUp = () =>
{
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => 
    {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <View> 
        </View>
    )
}

export default SignUp;