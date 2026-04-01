import * as FileSystem from 'expo-file-system/legacy';

// you must use your machine's local IP, not localhost (emulator can't reach localhost)
// run ipconfig | findstr IPv4 in terminal
const SERVER_URL = 'http://INSERT_LOCAL_IP_HERE:3000/transcribe';

export const transcribeAudio = async (audioUri: string): Promise<string> => {
    console.log('[Transcribe] Starting transcription for:', audioUri);

    try {
        const uploadResult = await FileSystem.uploadAsync(SERVER_URL, audioUri, {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'audio',
            mimeType: 'audio/wav',
        });

        if (uploadResult.status !== 200) {
            throw new Error(`Server error: ${uploadResult.status}`);
        }

        const body = JSON.parse(uploadResult.body);
        console.log('[Transcribe] Transcription result:', body.transcription);
        return body.transcription;

    } catch (err) {
        console.error('[Transcribe] Failed:', err);
        throw err;
    }
};