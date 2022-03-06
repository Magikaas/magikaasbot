class GuildQueueHandler {
    constructor() {
        this.queues = new Map();
    }

    addQueue(guildId, queue) {
        if (this.getQueue(guildId)) {
            console.log("A queue already exists for guild with id: " + guildId);
            return;
        }

        this.setQueue(guildId, queue);
    }

    setQueue(guildId, queue) {
        this.queues.set(guildId, queue);
    }

    getQueue(guildId) {
        return this.queues.get(guildId);
    }

    clearQueue(guildId) {
        const queue = this.queues.get(guildId);

        queue.clear();

        this.queues.set(guildId, queue);
    }
}

module.exports = GuildQueueHandler;