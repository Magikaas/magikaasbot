const GuildQueueHandler = require("./GuildQueueHandler");
const ytdl = require('ytdl-core');

class YoutubeQueueHandler extends GuildQueueHandler {
    constructor() {
        super();
        this._playing = false;
        this._startNext = false;
    }

    async start(guildId) {
        this._playing = true;
        this._startNext = true;

        /** @var queue Queue.Queue */
        const queue = this.getQueue(guildId);

        if (!queue) {
            return false;
        }

        const handler = this;

        // Then continue next after it finishes.
        this.getVoiceHandler(guildId).play(this.youtubeDownloadByQueue(queue.current()))
        .on("finish", () => {
            if(queue.next()) {
                this.playSong(queueItem);
            }
            else {
                handler.stop();
            }
        });
        
        return true;
    }

    resetQueue(guildId) {
        const queue = this.getQueue(guildId);

        queue.reset();
    }

    playSong(queueItem) {
        handler.play(this.youtubeDownloadByQueue(queueItem))
            .on("finish", () => {
                if (!queueItem.next()) {
                    return false;
                }
                
                queueItem = queueItem.next();

                this.playSong(queueItem);
            })
            .on("error", error => {
                console.error(error);
            });
    }

    nextSong() {

    }

    stop() {
        this._playing = false;
    }

    goToNext() {
        this._startNext = true;
    }

    isPlaying() {
        return this._playing;
    }

    youtubeDownloadByQueue(queueItem) {
        return ytdl(queueItem.value());
    }
}

module.exports = YoutubeQueueHandler;