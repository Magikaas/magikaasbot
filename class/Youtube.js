const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

// Handles fetching information from youtube through ytdl-core.

class Youtube {
    constructor() {
        this.ytdl = ytdl;
        this.ytsr = ytsr;
    }

    async getSongInfo(url) {
        return await this.ytdl.getInfo(url);
    }

    getSongStream(url, options = { filter: 'audioonly' }) {
        return this.ytdl(url, options);
    }

    async search(searchTerm, nrOfResults = 1) {
        return new Promise((resolve, reject) => {
            this.ytsr(searchTerm, { pages: 1 }).then(info => {
                const results = [];
                for (let i = 0; i < nrOfResults; i++) {
                    if (!info.items[i]) {
                        break;
                    }
                    if (info.items[i].type !== 'video') {
                        console.log('Not a video, instead: ', info.items[i].type);
                        nrOfResults++;
                        continue;
                    }
                    
                    const source = this.getSongStream(info.items[i].url, { filter: 'audioonly' });
                    results.push({ title: info.items[i].title, stream: source, url: info.items[i].url });
                }
            
                resolve(results);
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = new Youtube();