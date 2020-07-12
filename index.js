const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

// Import the config.
let config = require('../config.json');
const botEnv = require('./env.json');
const VoiceHandler = require('./class/VoiceHandler');
const RoleManager = require('./class/RoleManager');
const YoutubeQueueHandler = require('./class/YoutubeQueueHandler');
const Command = require('./class/Command');
const Character = require('./class/DND/Character');

client.commands = new Discord.Collection();
client.schedule = [];

const ERRORLOGFILE = "./error.log";

// Always guarantee an error log file.
guaranteeFile(ERRORLOGFILE);

function guaranteeFile(file) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, "");
    }
}

// Load the command files.
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

config = config[botEnv.version];
const prefix = config.prefix;

// Debugging, log the prefix of the bot.
console.log("Prefix: " + prefix);

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
    client.voiceHandlers[guildId] = new VoiceHandler.VoiceHandler(client);
}

client.addVoiceHandler = addVoiceHandler;

// Command handling.
client.on("message", async function(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length+1).split(/ +/);

    let commandName = args.shift().toLowerCase();

    let commandObject = client.commands.get(commandName);

    const command = new Command.Command(commandObject, args, message, client);

    command.run();
});

// Voice state handling for voice channel joining/leaving.
// Possibly move to voice manager.
client.on("voiceStateUpdate", voiceState => {
    if (!voiceState.channel) {
        return;
    }

    if (!client.voice.connections.find(connection => connection) ||
        !voiceState.channelID === client.voice.connections.find(connection => connection).channel) {
        return;
    }

    if (voiceState.channelID === client.voice.connections.find(connection => connection).channel.id) {
        if (voiceState.channel.members.size === 1) {
            client.voice.connections.find(connection => connection.channel.id === voiceState.channelID).disconnect();
        }
    }
});

client.voiceHandlers = {};

client.roleManager = new RoleManager.RoleManager();

client.ytQueueHandler = new YoutubeQueueHandler.YoutubeQueueHandler();

client.login(config.token);