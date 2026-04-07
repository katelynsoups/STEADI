const fetch = require('node-fetch');
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

const API_KEY = 'APIKEY';

app.post('/transcribe', upload.single('audio'), async (req, res) => {
    console.log('[Server] Received file:', req.file);
    console.log('[Server] File size:', req.file?.size);

    try {
        const audioBytes = fs.readFileSync(req.file.path);

        //changed to detecting rate and number of channels since different hardware will affect this
        const channelCount = audioBytes.readUInt16LE(22);
        const sampleRate = audioBytes.readUInt32LE(24);

        console.log('[Server] Detected channels:', channelCount);
        console.log('[Server] Detected sample rate:', sampleRate);

        const requestBody = {
            audio: { content: audioBytes.toString('base64') },
            config: {
                encoding: 'LINEAR16',
                languageCode: 'en-US',
                audioChannelCount: channelCount,
                sampleRateHertz: sampleRate,
                enableSeparateRecognitionPerChannel: channelCount > 1,
            },
        };

        const response = await fetch(
            `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            }
        );

        const data = await response.json();
        console.log('[Server] Google API response:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(data.error?.message ?? 'Google API error');
        }

        const transcription = (data.results ?? [])
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        console.log('[Server] Transcription:', transcription);

        fs.unlinkSync(req.file.path);

        res.json({ transcription });

    } catch (err) {
        console.error('[Server] Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));