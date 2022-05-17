const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const client = new Discord.Client();

// Import the config.
let config = require('../config.json');
const botEnv = require('./env.json');
const Tables = require('./mysql/tables');
const VoiceHandler = require('./class/VoiceHandler');
const RoleManager = require('./class/RoleManager');
const YoutubeQueueHandler = require('./class/YoutubeQueueHandler');
const Command = require('./class/Command');
const Queue = require('./class/Queue');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

function prepDatabase() {
    let importData = {};
    let table = {};
    let importFile = "";
    let where = {};
    for (let t in Tables) {
        table = Tables[t];
        table.sync().then((tableObject) => {
            importFile = "./data/" + tableObject.name + ".json";
            if (!fs.existsSync(importFile)) {
                return;
            }
            
            importData = require(importFile);
            for (let record of importData.data) {
                where = {};
                where[importData.uniqProp] = record[importData.uniqProp];
                let query = {
                    attributes: importData.fields,
                    where: where
                };
                tableObject.findAll(query).then((data) => {
                    if (data.length == 0) {
                        tableObject.create(record);
                    }
                }).catch((err) => {
                    console.log("Error", tableObject, query, err);
                });
            }
        }).catch((err) => {
            console.error("Table sync error", err);
        });
    }
}
// Only prep database for changes
console.log("Preparing Database");
prepDatabase();

// Neural Networking
const brain = require("brain.js");
const AutoDiscovery = require('./class/AutoDiscovery');

const discoverer = new AutoDiscovery();
discoverer.run();

const net = new brain.NeuralNetwork({
    hiddenLayers: [100, 100, 100]
});

client.net = net;
client.ai = {};

function train() {
    const trainingResult = client.trainNet(client.ai.trainingData);

    client.ai.errorMargin = trainingResult.error;

    return trainingResult;
}

client.train = train;

function trainNet(trainingData) {
    try {
        return client.net.train(trainingData, {
            logPeriod: 500,
            log: (error) => console.log(error)
        });
    }
    catch (e) {
        console.log(e.message);
        console.log(trainingData);
        return {};
    }
}

client.trainNet = trainNet;

function runNet(data) {
    return client.net.run(data);
}

client.runNet = runNet;

client.commands = new Discord.Collection();

const ERRORLOGFILE = "./error.log";

client.tts = {
    language: "nl-NL",
    gender: "MALE",
    queue: new Queue(),
    playing: false
};

// Always guarantee an error log file.
guaranteeFile(ERRORLOGFILE);

function guaranteeFile(file) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, "");
    }
}

const roleManager = new RoleManager();

if (!config.magikaasbot[botEnv.version]) {
    throw new Error("Unable to find configuration for Magikaasbot", botEnv.version, "environment");
}

config = config.magikaasbot[botEnv.version];
const prefix = config.prefix;

client.prefix = config.prefix;
client.googleApiKey = config.gapi_key;

client.config = config;

// Debugging, log the prefix of the bot.
console.log("Prefix: " + prefix);

function loadCommands(config) {
    // Load the command files.
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    
    // If config has any special values for commands, add them now.
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
    
        const configCommands = config.commands;
    
        if (Object.keys(configCommands).includes(command.name)) {
            for (let k in configCommands[command.name]) {
                command[k] = configCommands[command.name][k];
            }
        }
    
        client.commands.set(command.name, command);
    }
}

loadCommands(config);

client.loadCommands = loadCommands;

// Set the bot's presence.
client.once('ready', () => {
    client.user.setPresence({
        status: "online",
        afk: false,
        activity: {
            name: config.activity,
            type: "PLAYING"
        }
    });

    console.log('Ready, running on "' + client.user.username + '"!');
});

function getVoiceHandler(guildId) {
    return client.voiceHandlers[guildId];
}

client.getVoiceHandler = getVoiceHandler;

function addVoiceHandler(guildId) {
    client.voiceHandlers[guildId] = new VoiceHandler(client);
}

client.addVoiceHandler = addVoiceHandler;

// Command handling.
client.on("message", async function(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length + 1).split(/ +/);

    let commandName = args.shift().toLowerCase();

    let commandObject = client.commands.get(commandName);

    let voiceChannel = false;

    if (commandObject && commandObject.voice) {
        if (args.length > 0) {
            const channelName = args.join(" ");
            voiceChannel = message.guild.channels.cache.find(channel => channel.name === channelName);
        }
        else if (message.member.voice.channel) {
            voiceChannel = message.member.voice.channel;
        }
    }

    const command = new Command(commandObject, args, message, client, voiceChannel);

    command.run();
});

client.voiceUsers = [];

// Voice state handling for voice channel joining/leaving.
// Possibly move to voice manager.
client.on("voiceStateUpdate", voiceState => {
    if (!voiceState.channel) {
        return;
    }

    if (!client.voice.connections.find(connection => connection) ||
        voiceState.channelID !== client.voice.connections.find(connection => connection).channel) {
        return;
    }

    if (voiceState.channelID === client.voice.connections.find(connection => connection).channel.id) {
        if (voiceState.channel.members.size === 1) {
            const myChannel = client.voice.connections.get(voiceState.channelID);

            if (!!myChannel) {
                myChannel.disconnect();
            }
        }
    }
});

function writeLog(logString, logType = "error") {
    const date = new Date();
    
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }
    
    let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    fs.appendFile("./logs/" + logType + ".log", "[" + date.getHours() + ":" + minutes + ":" + seconds + " - " + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + "] " + logString + "\n", function(err) {
        // console.log("Wrote log to: " + logType);
    });
}

client.writeLog = writeLog;

client.voiceHandlers = {};

client.roleManager = roleManager;

client.ytQueueHandler = new YoutubeQueueHandler();

client.login(config.token);