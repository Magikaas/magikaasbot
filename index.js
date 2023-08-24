const fs = require('fs');

// Import the config.
const botConfig = require('../config.json');
const botEnv = require('../env.json');
const VoiceHandler = require('./class/VoiceHandler.js');
const RoleManager = require('./class/RoleManager.js');
const YoutubeQueueHandler = require('./class/YoutubeQueueHandler.js');
const Command = require('./class/Command.js');
const Queue = require('./class/Queue.js');
const Discord = require('discord.js');

const { REST, Routes } = require('discord.js');

const { Events } = require('discord.js');

const config = botConfig["magikaasbot"][botEnv.version];

const prefix = config.prefix;

const intents = [];

for (let k in config.intents) {
    if (config.intents[k]) {
        intents.push(Discord.GatewayIntentBits[config.intents[k]]);
    } else {
        delete config.intents[k];
    }
}

const client = new Discord.Client({'intents': intents, 'partials': config.partials});

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

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

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

client.once('ready', async () => {
    client.user.setPresence({
        activities: [{
            name: "Testing",
            type: Discord.ActivityType.Custom,
            state: "🍓"
        }],
    });

    console.log('Ready, running on "' + client.user.username + '"!');
    
    const commands = [];
    
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
    
        const configCommands = config.commands;
    
        if (Object.keys(configCommands).includes(command.name)) {
            for (let k in configCommands[command.name]) {
                command[k] = configCommands[command.name][k];
            }
        }
    
        if (!command.weight) {
            command.weight = 100;
        }

        if (!command.data) {
            continue;
        }

        if (!command.active) {
            continue;
        }

        console.log("Registering command " + command.name);

        commands.push(command);
    }
    
    // Register slash commands as per https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
    
    const rest = new REST({ version: '10' }).setToken(config.token);
    
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(client.application.id),
                { body: commands.map(c => c.data.toJSON()) },
            );
    
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();

    commands.forEach(command => { client.commands.set(command.name, command); });
});

client.rest.on("rateLimited", (info) => {
    console.log("Client encountered a rate limit: ", info);
});

function getVoiceHandler(guildId) {
    return client.voiceHandlers[guildId];
}

client.getVoiceHandler = getVoiceHandler;

function addVoiceHandler(guildId) {
    client.voiceHandlers[guildId] = new VoiceHandler(client, guildId);
}

client.addVoiceHandler = addVoiceHandler;

function removeVoiceHandler(guildId) {
    delete client.voiceHandlers[guildId];
}

client.removeVoiceHandler = removeVoiceHandler;

client.cooldowns = new Discord.Collection();

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        // Figure out how to handle buttons.
        // if (interaction.isButton()) {
        //     if (interaction.customId === "tts_stop") {
        //         if (client.tts.playing) {
        //             client.tts.queue = new Queue();
        //             client.tts.playing = false;
        //             interaction.reply("Stopped playing TTS.");
        //         }
        //     }
        // }

        if (interaction.isAutocomplete()) {
            interaction.client = client;
            const commandObj = new Command(command, interaction, client);
            await commandObj.autocomplete(interaction);
        }
        return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    const channel = interaction.channel;

    if (command.guildOnly && channel.type !== Discord.ChannelType.GuildText) {
        return interaction.reply('I can\'t execute that command inside DMs!');
    } else if (command.dmOnly && channel.type !== 'dm') {
        return interaction.reply('I can\'t execute that command inside a guild!');
    } else if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${interaction.user.username}!`;
        
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return interaction.reply(reply);
    }

    // Check the cooldown of this command for this user.
    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Discord.Collection());
    } else {
        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    }

    try {
        interaction.client = client;
        const commandObj = new Command(command, interaction, client);
        await commandObj.run();
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Voice state handling for voice channel joining/leaving.
// Possibly move to voice manager.
client.on("voiceStateUpdate", voiceState => {
    // TODO Fix this for current Discord.js version
    return false;
    if (!voiceState) return;
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
});

client.voiceUsers = [];

// Voice state handling for voice channel joining/leaving.
// Possibly move to voice manager.
client.on("voiceStateUpdate", voiceState => {
    if (!voiceState.channel) {
        return;
    }

    return;

    if (!client.voice.adapters.find(connection => connection) ||
        !voiceState.channelID === client.voice.connections.find(connection => connection).channel) {
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