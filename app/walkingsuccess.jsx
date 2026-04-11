import { useLocalSearchParams } from 'expo-router';
import Success from '../src/components/Success';
import { updateSaveStatus } from '../src/utils/saveUnit';

const WalkingSuccessPage = () =>
{
    const { test } = useLocalSearchParams();
    updateSaveStatus(`/walkingsuccess`);

    return (
        <Success text = {"Thank you for uploading your walking assessment!"} nextRoute = {'/homehazards'}/>
    );
};

export default WalkingSuccessPage;
