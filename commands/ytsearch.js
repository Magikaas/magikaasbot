const https = require("https");
const ytdl = require('ytdl-core');

module.exports = {
    name: "ytsearch",
    description: "Youtube search.",
    async execute(message, args) {
        const googleApiKey = message.client.googleApiKey;

        const data = {
            q: args.join(" "),
            key: googleApiKey,
            type: 'video'
        };

        const options = {
            hostname: "www.googleapis.com",
            port: 443,
            path: "/youtube/v3/search?" + new URLSearchParams(data).toString(),
            method: 'GET',
            headers: {
                "Accept": "application/json"
            }
        };

        let videoId = "";
        let videoInfo = {};
        let videoUrl = "";
        let videoTitle = "";

        const req = https.request(options, res => {
            console.log(`Statuscode: ${res.statusCode}`);

            let output = "";

            res.on('data', d => {
                output += String(d);
            });

            res.on('end', async () => {
                let jsonData = JSON.parse(output);

                if (!jsonData || jsonData.items.length === 0) {
                    message.reply("No video found");
                    return;
                }

                videoId = jsonData.items[0].id.videoId;

                videoUrl = "https://www.youtube.com/watch?v=" + videoId;

                videoInfo = await ytdl.getInfo(videoUrl);

                console.log(videoInfo.title);

                videoTitle = "";

                if (!videoInfo.videoDetails) {
                    videoTitle = videoInfo.title;
                }
                else {
                    videoTitle = videoInfo.videoDetails.title;
                    videoUrl = videoInfo.videoDetails.video_url;
                }

                message.reply("Playing: \"" + videoTitle + "\" (" + videoUrl + ")");
            })
        });

        req.on('error', e => {
            console.log(e);
            message.reply("Something went wrong attempting to search for a video: " + e.message);
        });

        const d = JSON.stringify(data);

        req.write(d);

        req.end();
    }
};