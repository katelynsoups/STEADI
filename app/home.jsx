import Home from '../src/components/Home';
import {useEffect} from 'react';
import {BackHandler} from 'react-native';

const HomePage = () => {

    useEffect(() =>
    {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, []);

    return (
        <Home />
    );
};

export default HomePage;