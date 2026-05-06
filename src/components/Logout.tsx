import React from 'react';
import { styles } from '../styles/styles';
import {Text} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { auth } from '../utils/gcipAuth';
import { signOut } from 'firebase/auth';

const Logout = () =>
{
    const { t, i18n } = useTranslation();
    const router = useRouter()

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            router.navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    //Once we have a way to determine if a user has an unfinished/past assessments, implement ways to change button placement based on state

    return (
        <Text style = {styles.logout} onPress = {handleLogOut}>{t('logout.button')}</Text>
    )
}

export default Logout;