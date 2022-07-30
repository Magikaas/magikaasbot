const fs = require('fs');
const MusicQueue = require('./MusicQueue');
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, entersState, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');

class VoiceHandler {
    constructor(client) {
        this._client = client;
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
            vc = getVoiceConnection(this._channel.guild.id);
        }

        if (vc) {
            return vc;
        }
        else {
            return null;
        }
    }

    createAudioPlayer() {
        return createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
    }

    getAudioPlayer() {
        return this._audioPlayer;
    }

    async connect() {
        if (this._channel) {
            const connection = joinVoiceChannel({
                channelId: this._channel.id,
                guildId: this._channel.guild.id,
                adapterCreator: this._channel.guild.voiceAdapterCreator,
                selfDeaf: false
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
                }
            });

            this.setConnection(connection);

            // Subscribe the connection to the audio player (will play audio on the voice connection)
            const subscription = connection.subscribe(this.createAudioPlayer());

            return true;
        }

        return false;
    }

    disconnect() {
        this.getConnection().destroy();
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
        
        return this.playSoundFile(soundFile);
    }

    playSoundFile(soundFile) {
        return this.play(soundFile);
    }

    playYT(youtubeURL, guildId) {
        const guild = this._client.guilds.cache.get(guildId);

        if (guild) {
            const queue = this._queueHandler.getQueue(guildId);

            if (queue) {
                queue.addYT(youtubeURL);
            }

            this.playYTFromQueue(youtubeURL, guildId);
        }
        return this.play(youtubeURL, connection);
    }

    playLoop(source) {
        const that = this;
        return new Promise(function(resolve, reject) {
            if (that.canFindRandomSoundFile(source)) {
                that.playSound(source)
                .on('speaking', value => {
                    if (value == 0) {
                        resolve(source);
                    }
                })
            }
            else {
                reject(source);
            }
        });
    }

    playYTFromQueue(youtubeURL, guildId) {
        const guild = this._client.guilds.cache.get(guildId);
        const queue = this._queueHandler.getQueue(guildId);

        if (guild && queue) {
            const connection = this.getConnection();

            if (connection) {
                const player = connection.player;

                if (player) {
                    const resource = createAudioResource(youtubeURL);
                    player.play(resource);

                    connection.subscribe(player);
                }
            }
        }
    }

    play(source, guild) {
        if (this.isConnected()) {
            try {
                let player = this.getAudioPlayer();

                if (!player) {
                    player = this.createAudioPlayer();
                }

                let audioResource = createAudioResource(source);

                if (player) {
                    player.play(audioResource, { volume: 0.5 });
                    const voiceConnection = getVoiceConnection(guild.id);
                    voiceConnection.subscribe(player);
                }
                else {
                    console.log("No audio player found");
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            console.log("Unable to play sound, not connected to voice channel.");
        }
    }

    startQueue(guildId) {
        this._queueHandler.start(guildId);
    }

    isConnected() {
        return !!this._connection;
    }
}

module.exports = VoiceHandler;