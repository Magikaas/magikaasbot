const ytdl = require('ytdl-core');
const MusicQueue = require('../class/MusicQueue');

module.exports = {
    name: "add",
    description: "Add a youtube video to the queue.",
    async execute(message, args) {
        let queue = message.client.ytQueueHandler.getQueue(message.guild.id);
        
        if (!queue) {
            queue = new MusicQueue();
            message.client.ytQueueHandler.setQueue(message.guild.id, queue);
        }

        const songInfo = await ytdl.getInfo(args[0]);

        queue.push(songInfo);

        message.channel.send("Added '" + songInfo.title + "' to the queue.\nTotal items in queue: " + queue.getLength());
    }
};