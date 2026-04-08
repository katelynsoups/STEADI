import React from 'react';
import { styles } from '../styles/styles';
import {Text} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const Logout = () =>
{
    const { t, i18n } = useTranslation();
    const router = useRouter()

    const handleLogOut = () => 
    {
        //Need log out logic, currently sends user to index.jsx
        router.navigate('/');
    }

    //Once we have a way to determine if a user has an unfinished/past assessments, implement ways to change button placement based on state

    return (
        <Text style = {styles.logout} onPress = {handleLogOut}>{t('logout.button')}</Text>
    )
}

export default Logout;