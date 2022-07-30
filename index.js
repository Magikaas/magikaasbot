const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');

// Import the config.
let config = require('../config.json');
const botEnv = require('./env.json');

if (!config.magikaasbot[botEnv.version]) {
    throw new Error("Unable to find configuration for Magikaasbot", botEnv.version, "environment"); // Throw an error if the config is not found.
}

config = config.magikaasbot[botEnv.version];

const prefix = config.prefix;
const client = new Discord.Client({intents: config.intents});

client.prefix = config.prefix;
client.googleApiKey = config.gapi_key;  // Google API key.  This is used to get the youtube video information.

client.config = config;

// Debugging, log the prefix of the bot.
console.log("Prefix: " + prefix);

const Tables = require('./mysql/tables');
const VoiceHandler = require('./class/VoiceHandler');
const RoleManager = require('./class/RoleManager');
const YoutubeQueueHandler = require('./class/YoutubeQueueHandler');
const Command = require('./class/Command');
const Queue = require('./class/Queue');

const sequelize = new Sequelize('database', 'user', 'password', {   // Create a new sequelize instance.
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

function prepDatabase() {   // Prepare the database.
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

function recoverNeuralNetwork() {
    console.log("Recovering neural network");
    recoverTrainingData();
    
    if (fs.existsSync("./data/ai/neuralNetwork.json")) {
        client.net.fromJSON(JSON.parse(fs.readFileSync("./data/ai/neuralNetwork.json"))); // Load the neural network.
    }

    if (client.net.isRunnable) {
        console.log("Neural network is runnable");
        client.ai.errorMargin = client.net.trainOpts.errorThresh;
    }
    else {
        console.log("Neural network is not runnable");
        train((error) => { console.log(error) });
    }
}

// Neural Networking
const brain = require("brain.js");
const AutoDiscovery = require('./class/AutoDiscovery');

const discoverer = AutoDiscovery;
discoverer.run();

const net = new brain.NeuralNetwork({
    hiddenLayers: [100, 25, 4],
});

client.net = net;
client.ai = {};

function train(callback = null) {
    const trainingResult = client.trainNet(client.ai.trainingData, callback);

    client.ai.errorMargin = trainingResult.error;

    return trainingResult;
}

client.train = train;

function showTrainingData() {
    console.log("Showing training data");
    console.log(client.ai.trainingData);
}

client.showTrainingData = showTrainingData;

function giveMessages(message, channel, messages) {
    let messageIndex = 0;
    let messageInterval = setInterval(() => {
        channel.send(messages[messageIndex]);
        messageIndex++;
        if (messageIndex >= messages.length) {
            clearInterval(messageInterval);
        }
    }, message.author.id == client.user.id ? 1000 : 2000);
}

function whatIs(message) {
    let result = "";
    let words = message.content.split(" ");
    for (let i = 1; i < words.length; i++) {
        result += words[i] + " ";
    }
    return result;
}

function getRoleManager(guildId) {
    return client.roleManagers[guildId];
}

function trainNeuralNetwork(message, channel) {
    let result = "";
    let words = message.content.split(" ");
    for (let i = 1; i < words.length; i++) {
        result += words[i] + " ";
    }
    channel.send("Learning: " + result);
    client.ai.trainingData.push({
        input: {
            [result.toLowerCase()]: 1
        },
        output: {
            [message.author.id]: 1
        }
    });
    train((error) => { console.log(error) });
}

function useNeuralNetwork(message) {
    let result = runNet(whatIs(message));
    let max = 0;
    let maxKey = "";
    for (let k in result) {
        if (result[k] > max) {
            max = result[k];
            maxKey = k;
        }
    }
    if (max > 0.5) {
        return maxKey;
    }
    return null;
}

client.useNeuralNetwork = useNeuralNetwork;

function trainNet(trainingData, callback) {
    console.log("Training neural network");
    try {
        return client.net.train(trainingData, {
            logPeriod: 500,
            log: callback,
            errorThresh: 0.005,
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
    
        client.commands.set(command.name, command); // Add the command to the collection.
    }
}

loadCommands(config);   // Load the commands.

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
    }); // Set the bot's presence.  This is used to show the bot's status.

    console.log('Ready, running on "' + client.user.username + '"!');   // Log the bot is ready.
});

function getVoiceHandler(guildId) {
    return client.voiceHandlers[guildId];
}

client.getVoiceHandler = getVoiceHandler;

function addVoiceHandler(guildId) {
    client.voiceHandlers[guildId] = new VoiceHandler(client);   // Create a new voice handler.  This will be used to play audio.
}

client.addVoiceHandler = addVoiceHandler;

// Command handling.
client.on("message", async function(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;  // Ignore messages that don't start with the prefix.

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

    if (voiceState.member.user.bot) {
        return;
    }

    let isInRelevantVoiceChannel = false;
    let relevantVoiceChannelId = null;

    if (voiceState.guild.id in client.voiceHandlers) {
        relevantVoiceChannelId = client.voiceHandlers[voiceState.guild.id].getChannel().id;
        isInRelevantVoiceChannel = voiceState.channel.id === relevantVoiceChannelId;
    }

    // Disconnect if only user in voice channel
    if (isInRelevantVoiceChannel && voiceState.guild.voice.channel) {
        if (voiceState.guild.voice.channel.members.size === 1) {
            voiceState.guild.voice.channel.leave();
        }
    }
    return;
    
    // WIP
    try {
        for (const [key, channel] of client.voice.adapters) {
            console.log(key + " = " + voiceState.channel.id);
            if (key === voiceState.channel.id) {
                isInRelevantVoiceChannel = true;
                relevantVoiceChannelId = key;
                break;
            }
        }

        if (!isInRelevantVoiceChannel) {
            return;
        }
    }
    catch (e) {
        writeToErrorLog(e);
    }

    console.log(voiceState.channelID + " = " + relevantVoiceChannelId);
    if (voiceState.channelID === relevantVoiceChannelId) {
        console.log("Relevant Channel");
        if (voiceState.channel.members.size === 1) {    // If the channel only contains the bot, disconnect.
            const myChannel = client.voice.adapters.get(voiceState.channelID);
            console.log(myChannel);

            if (!!myChannel) {
                client.voice.disconnect();
                myChannel.disconnect(); // Disconnect from the voice channel.
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
    fs.appendFileSync("./logs/" + logType + ".log", "[" + date.getHours() + ":" + minutes + ":" + seconds + " - " + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + "] " + logString + "\n", function(err) {
        // console.log("Wrote log to: " + logType);
    });
}

client.writeLog = writeLog;

function writeToErrorLog(logString) {
    console.log("Writing to error log: " + logString);
    writeLog(logString, "error");
}

client.voiceHandlers = {};

client.roleManager = roleManager;

client.ytQueueHandler = new YoutubeQueueHandler();

client.login(config.token);

function dumpNeuralNetwork() {
    const json = client.net.toJSON();
    console.log("Dumping neural network...");
    fs.writeFileSync("./data/ai/neuralNetwork.json", JSON.stringify(json));
    console.log("Neural network dumped.");

    console.log("Dumping neural network weights...");
    fs.writeFileSync("./data/ai/neuralNetworkWeights.json", JSON.stringify(client.net.toJSON().layers));
    console.log("Neural network weights dumped.");

    console.log("Dumping neural network biases...");
    fs.writeFileSync("./data/ai/neuralNetworkBiases.json", JSON.stringify(client.net.toJSON()));
    console.log("Neural network biases dumped.");
}

client.dumpNeuralNetwork = dumpNeuralNetwork;

function recoverTrainingData() {
    console.log("Recovering training data...");
    const trainingData = fs.readFileSync("./data/ai/trainingdata.json", "utf8");
    client.ai.trainingData = JSON.parse(trainingData);
    console.log("Training data recovered.");
}

client.recoverTrainingData = recoverTrainingData;

recoverNeuralNetwork(); // Recover the neural network.

if (config.debug) {
    console.log("Debug mode enabled.");
    const debugCommand = client.commands.get("sim");

    debugCommand.execute(null, ["sim", 1]);
}

let process = require("process");

process.on("SIGINT", () => {
    dumpNeuralNetwork();
    process.exit(0);
}
);

process.on("exit", () => {
    console.log("Exiting...");
    client.destroy();
});