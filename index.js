const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

// Import the config.
let config = require('./config.json');
const botEnv = require('./env.json');
const VoiceHandler = require('./class/VoiceHandler');
const RoleManager = require('./class/RoleManager');

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

// Command handling.
client.on("message", async function(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length+1).split(/ +/);
    let command = args.shift().toLowerCase();

    command = client.commands.get(command);

    // Admin only means admin only
    if (command.adminOnly && !client.RoleManager.senderIsAdmin(message)) return;

    let hasRole = false;

    if (command.requiredRoles) {
        for (const role of command.requiredRoles) {
            if (client.RoleManager.senderHasRoleWithName(message, role)) {
                hasRole = true;
                break;
            }
        }
    }
    else {
        hasRole = true;
    }

    if (!hasRole) {
        message.reply("You lack the required permissions to execute this command");
        return;
    }

    if (command.voice && !client.voiceHandler.isConnected()) {
        if (!await client.voiceHandler.connect(message.member.voice.channel)) {
        }
    }

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.log(error);
        message.reply("There was an error trying to execute command: '" + command.name + "'.");
        // message.reply("Error: " + error.message);
    }
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

client.voiceHandler = new VoiceHandler.VoiceHandler();

client.roleManager = new RoleManager.RoleManager();

client.login(config.token);