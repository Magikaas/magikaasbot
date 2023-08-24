const fs = require('fs');
const exec = require('child_process');
const speech = require('@google-cloud/speech');

module.exports = {
    name: "vtt",
    description: "Command description",
    async execute(message, args) {
        // const filename = "";
        // // Read the audio file into a buffer
        // const file = fs.readFileSync(fileName);
        // const audioBytes = file.toString('base64');

        // // Use the Google Cloud Speech-to-Text API to transcribe the audio
        // const transcription = exec(
        // `gcloud ml speech recognize-long-running ${fileName} --language-code=en-US --async`,
        // (error, stdout, stderr) => {
        //     if (error) {
        //     console.error(`exec error: ${error}`);
        //     return;
        //     }

        //     // Use a Python NLP library to analyze the transcription
        //     exec('python nlp.py ' + stdout, (error, stdout, stderr) => {
        //     if (error) {
        //         console.error(`exec error: ${error}`);
        //         return;
        //     }
        //     console.log(`NLP output: ${stdout}`);
        //     });
        // }
        // );
        
        // Record audio from discord voice channel
        // Use the Google Cloud Speech
        // Use a Python NLP library to analyze the transcription
        const client = new speech.SpeechClient();

        const filename = './resources/audio.raw';
        const encoding = 'LINEAR16';
        const sampleRateHertz = 16000;
        const languageCode = 'en-US';

        const request = {
            config: {
                encoding: encoding,
                sampleRateHertz: sampleRateHertz,
                languageCode: languageCode,
            },
            interimResults: false, // If you want interim results, set this to true
        };

        // Stream the audio to the Google Cloud Speech API
        const recognizeStream = client
            .streamingRecognize(request)
            .on('error', console.error)
            .on('data', data =>
                process.stdout.write(
                    data.results[0] && data.results[0].alternatives[0]
                        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                        : '\n\nReached transcription time limit, press Ctrl+C\n'
                )
            );

        // Stream an audio file from disk to the Speech API, e.g. "./resources/audio.raw"
        fs.createReadStream(filename).pipe(recognizeStream);

        console.log('Listening, press Ctrl+C to stop.');

        // Use a Python NLP library to analyze the transcription
        exec('python nlp.py ' + stdout, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`NLP output: ${stdout}`);
        });
    }
};
