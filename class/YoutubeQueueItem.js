const QueueItem = require("./QueueItem");

class YoutubeQueueItem extends QueueItem {
    constructor() {}
    url() {
        return this._item.url;
    }
}