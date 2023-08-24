const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, entersState, createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('fs');
const MusicQueue = require('./MusicQueue.js');

class VoiceHandler {
    constructor(client, guildId) {
        this._client = client;
        this._guildId = guildId;
        this._status = 'idle';
        this._channel = null;
        this._connection = null;
        this._subscription = null;
        this._audioPlayer = null;
        this._queueHandler = null;

        console.log(`VoiceHandler initialized in ${guildId}.`);
        this.setQueueHandler(this._client.ytQueueHandler);
    }

    setQueueHandler(queueHandler) {
        this._queueHandler = queueHandler;
    }

    getQueueHandler() {
        return this._queueHandler;
    }

    endPlaying() {
        const connection = this.getConnection();

        if (connection) {
            connection.dispatcher.end();
        }
    }

    syncVoiceChannel() {
        let channel = this.getCurrentVoiceChannel();

        this._channel = channel;
    }

    isInVoice() {
        return !!this.getCurrentVoiceChannel();
    }

    getCurrentVoiceChannel() {
        return this._client.channels.cache.find(channel => channel.type === "voice" && channel.members.find(member => member.id === this._client.user.id));
    }

    setChannel(channel) {
        this._channel = channel;
    }

    getChannel() {
        return this._channel;
    }

    setConnection(connection) {
        this._connection = connection;
    }

    getConnection() {
        let vc = null;
        if(this._connection) {
            return this._connection;
        }
        else {
            vc = getVoiceConnection(this._guildId);
        }

        if (vc) {
            return vc;
        }
        else {
            return null;
        }
    }

    isSubscribed() {
        return !!this.getSubscription();
    }
        

    subscribe() {
        const connection = this.getConnection();

        if (connection) {
            const subscription = connection.subscribe(this.getAudioPlayer());

            this.setSubscription(subscription);
        }
    }

    unsubscribe() {
        const connection = this.getConnection();

        if (connection) {
            connection.unsubscribe(this.getAudioPlayer());
        }

        this.setSubscription(null);
    }

    createAudioPlayer() {
        return createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
    }

    getAudioPlayer() {
        if (!this._audioPlayer) {
            this._audioPlayer = this.createAudioPlayer();
            this._audioPlayer.on('stateChange', (oldState, newState) => {
                // console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
                if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                    console.log('Audio player has no more track to play!');
                    this.getQueueHandler().next();
                    this.play();
                }
            })
            .on('error', error => {
                console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
            });
        }
        return this._audioPlayer;
    }

    setSubscription(subscription) {
        this._subscription = subscription;
    }

    getSubscription() {
        return this._subscription;
    }

    async connect(channel = null) {
        const that = this;
        if (channel) {
            this.setChannel(channel);
        }
        
        if (this._channel) {
            const connection = joinVoiceChannel({
                channelId: this._channel.id,
                guildId: this._guildId,
                adapterCreator: this._channel.guild.voiceAdapterCreator,
                selfMute: false,
                selfDeaf: false,
            });

            connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                    // Seems to be reconnecting to a new channel - ignore disconnect
                } catch (error) {
                    // Seems to be a real disconnect which SHOULDN'T be recovered from
                    connection.destroy();
                    
                    that.setConnection(null);
                }
            });

            this.setConnection(connection);

            // Subscribe the connection to the audio player (will play audio on the voice connection)
            const subscription = connection.subscribe(this.createAudioPlayer());

            this.setSubscription(subscription);

            return connection;
        }

        return null;
    }

    disconnect() {
        console.log('Disconnecting from voice channel.');
        this.getConnection().destroy();
        this._connection = null;
    }

    soundCategoryExists(sound) {
        // If we have a directory for a sound.
        const soundDir = "./sound/" + sound;

        return fs.existsSync(soundDir);
    }

    canFindRandomSoundFile(sound) {
        const soundFile = this.getRandomSoundFile(sound);

        return fs.existsSync(soundFile);
    }

    // Guarantee the voicehandler has a queue for the guild.
    guaranteeQueue(guildId) {
        if (!this._queueHandler.hasQueue(guildId)) {
            this._queueHandler.addQueue(guildId, new MusicQueue());
        }
    }

    getRandomSoundFile(sound) {
        // If we have a directory for a sound.
        const soundDir = "./sound/" + sound;
        let soundFile = "";

        if (fs.existsSync(soundDir)) {
            const files = fs.readdirSync(soundDir);
    
            const fileName = Math.floor(Math.random() * files.length) + 1;
    
            soundFile = soundDir + "/" + fileName + ".mp3";
        }
        else {
            soundFile = "./sound/" + sound + ".mp3";
        }

        return soundFile;
    }

    playSound(sound) {
        let soundFile = this.getRandomSoundFile(sound);
        
        return this.playAudioFile(soundFile);
    }

    playAudioFile(audioFile) {
        console.log("Playing sound file: " + audioFile);
        const resource = createAudioResource(audioFile);

        this.guaranteeQueue(this._guildId);

        // Add the soundfile to the queue and play the queue
        this.getQueue().addSoundFile(resource);

        this.play();
    }

    playLoop(source) {
        console.log("Playing looped sound: " + source);
        this.guaranteeQueue(this._guildId);

        // Add the soundfile to the queue and play the queue
        this.getQueue().addLoopingSoundFile(source);

        // Make sure the sound is re-added to queue after it finishes playing
        this.getAudioPlayer().on(AudioPlayerStatus.Idle, () => {
            // Only add the sound to the queue if it's not already in the queue and the voicehandler is looping for this guild
            if (!this.getQueue().hasSoundFile(source) && this._queueHandler.isLooping(this._guildId)) {
                console.log("Adding looped sound to queue!!!!!!!!!!!!!!!!");
                this.getQueue().addLoopingSoundFile(source);
            }

            console.log("Playing looped sound.");
        });

        return Promise.resolve();
    }

    async play(soundfilePath) {
        // // Play a soundfile
        // if (soundfilePath) {
        //     console.log("Playing soundfile: " + soundfilePath);

        //     // Check if file exists
        //     if (!fs.existsSync(soundfilePath)) {
        //         console.log("File does not exist: " + soundfilePath);
        //         return;
        //     }
        //     const resource = createAudioResource(soundfilePath);

        //     this.getAudioPlayer().play(resource);

        //     this.getConnection().subscribe(this.getAudioPlayer());
        //     return;
        // }
        // return;
        console.log('Playing...');
        // If not connected to a voice channel, connect to one.
        if (!this.isConnected()) {
            console.log('Connecting to voice channel.');
            await this.connect();
        }
        else {
            console.log('Already connected to voice channel.');
            // console.log(this.getConnection());
        }
        
        if (!this._queueHandler.queueIsEmpty(this._guildId)) {
            if (this._status !== 'playing') {
                console.log('Starting to play.');
                this._status = 'playing';
            }
            const receiver = this.getConnection().receiver;
            const userId = this._client.user.id;
            const user = this._client.user;
            // this.createListeningStream(receiver, userId, user);

            console.log('Queue is not empty.');
            const queue = this._queueHandler.getQueue(this._guildId);
            const stream = queue.currentValue();
            const resource = createAudioResource(stream);

            this.getAudioPlayer().play(resource);

            // Do not forget to subscribe to the audioplayer... >_>
            this.subscribe();

            this.getAudioPlayer().on(AudioPlayerStatus.Idle, () => {
                console.log('Audio player is idle.');
            });

            this.getAudioPlayer().on('error', error => {
                console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
            });

            this.getAudioPlayer().on('debug', message => {
                // console.log(`Debug: ${message}`);
            });
        }
        else {
            console.log('Queue is empty.');
            this._status = 'idle';
        }
    }

    createListeningStream(receiver, userId, user) {
        const opusStream = receiver.subscribe(userId, {
            end: {
                behavior: EndBehaviorType.AfterSilence,
                duration: 5000,
            },
        });
        const decode = new prism.opus.Decoder({
            channels: 2,
            rate: 48000,
            frameSize: 960,
        });
        const filename = `./recordings/${Date.now()}-${getDisplayName(userId, user)}.ogg`;
        const out = createWriteStream(filename);
        console.log(`👂 Started recording ${filename}`);
    
        pipeline(opusStream, decode, out, (err) => {
            if (err) {
                console.warn(`❌ Error recording file ${filename} - ${err.message}`);
                throw err;
            } else {
                console.log(`✅ Recorded ${filename}`);
            }
        });
    }

    pause() {
        if (this._status === 'playing') {
            this._status = 'paused';
            this.getAudioPlayer().pause();
        }
    }

    resume() {
        if (this._status !== 'playing') {
            this._status = 'playing';
            this.getAudioPlayer().unpause();
        }
    }

    stop() {
        if (this._status !== 'idle') {
            this._status = 'idle';
            this.getAudioPlayer().stop();
        }
    }

    skip() {
        if (this._status !== 'idle') {
            this.getAudioPlayer().stop();
            this._queueHandler.next();
            this.play();
        }
    }

    isPlaying() {
        return this._status === 'playing';
    }

    isPaused() {
        return this._status === 'paused';
    }

    addSoundToQueue(sound) {
        if (this.soundCategoryExists(sound)) {
            this._queueHandler.add(sound);
        }
        else {
            this._queueHandler.add(sound + ".mp3");
        }
    }

    addSoundFileToQueue(soundFile) {
        this._queueHandler.add(soundFile);
    }

    addSoundsToQueue(sounds) {
        const that = this;
        sounds.forEach(function(sound) {
            that.addSoundToQueue(sound);
        });
    }

    addSoundFilesToQueue(soundFiles) {
        const that = this;
        soundFiles.forEach(function(soundFile) {
            that.addSoundFileToQueue(soundFile);
        });
    }

    clearQueue() {
        this._queueHandler.clear();
    }

    getQueue() {
        return this._queueHandler.getQueue(this._guildId);
    }

    getQueueItem(index) {
        return this._queueHandler.getQueueItem(this._guildId, index);
    }

    // play(source) {
    //     if (this.isConnected()) {
    //         try {
    //             let player = this.getAudioPlayer();

    //             if (!player) {
    //                 player = this.createAudioPlayer();
    //             }

    //             let audioResource = createAudioResource(source);

    //             if (player) {
    //                 player.play(audioResource, { volume: 0.5 });
                    
    //                 const connection = this.getConnection();

    //                 const dispatcher = connection.play(audioResource);
    //                 voiceConnection.subscribe(player);
    //             }
    //             else {
    //                 console.log("No audio player found");
    //             }
    //         }
    //         catch (e) {
    //             console.log(e);
    //         }
    //     }
    //     else {
    //         console.log("Unable to play sound, not connected to voice channel.");
    //     }
    // }

    startQueue(guildId) {
        this._queueHandler.start(guildId);
    }

    isConnected() {
        return !!this._connection;
    }
}

module.exports = VoiceHandler;