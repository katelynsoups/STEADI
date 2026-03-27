import { useLocalSearchParams } from 'expo-router';
import Success from '../src/components/Success';
import { updateSaveStatus } from '../src/utils/saveUnit';

const SuccessPage = () =>
{
    const { test } = useLocalSearchParams();
    const isWalking = test === 'walking';
    const nextRoute = isWalking ? '/homehazards' : '/walkingupload';
    const message = isWalking
        ? 'Thank you for uploading your walking assessment!'
        : 'Thank you for uploading your vision assessment!';

    updateSaveStatus(`/success?test=${test}`);

    return (
        <Success text = {message} nextRoute = {nextRoute}/>
    );
};

export default SuccessPage;
