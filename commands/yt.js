const https = require("https");
const ytdl = require('ytdl-core');

module.exports = {
    name: "yt",
    description: "Play a youtube video in a voice channel.",
    voice: true,
    async execute(message, args) {
        // No url provided
        if (!args[0].startsWith("http")) {
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
    
                    if (!jsonData) {
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

                    message.client.getVoiceHandler(message.guild.id).play(await ytdl(videoUrl));
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
        else {
            const songInfo = await ytdl.getInfo(args[0]);
    
            message.channel.send("Now playing: " + songInfo.title);

            message.client.getVoiceHandler(message.guild.id).play(await ytdl(args[0]));
        }
    }
};