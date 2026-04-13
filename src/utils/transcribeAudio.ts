import * as FileSystem from 'expo-file-system/legacy';
import { getAuth } from 'firebase/auth';

const SERVER_URL = 'https://vision-server-228929058201.us-central1.run.app/transcribe';

export const transcribeAudio = async (audioUri: string): Promise<string> => {
    console.log('[Transcribe] Starting transcription for:', audioUri);

    try {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();

        if (!token) {
            throw new Error('No auth token available');
        }

        console.log('[Transcribe] Token obtained');

        // read file as base64
        const base64 = await FileSystem.readAsStringAsync(audioUri, {
            encoding: 'base64'
        });

        console.log('[Transcribe] File read as base64, length:', base64.length);

        // send as JSON instead of multipart to avoid iOS FormData issues
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ audio: base64 })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const body = await response.json();
        console.log('[Transcribe] Transcription result:', body.transcription);
        return body.transcription;

    } catch (err) {
        console.error('[Transcribe] Failed:', err);
        throw err;
    }
};