const Youtube = require('../class/Youtube.js');
const { SlashCommandBuilder } = require('discord.js');
const MusicQueue = require('../class/MusicQueue.js');

const SEARCH_MIN_LENGTH = 4;
const errors = {
    no_search_term: "No search term provided!",
    search_term_too_short: "Search term too short!",
    no_option_selected: "No option selected for that query!",
    no_video_found: "No video was found with that query!",
    no_voice_channel: "You need to be in a voice channel to use this command!"
};

// Cache for search results for execution
const searches = new Map();

module.exports = {
    data: new SlashCommandBuilder()
            .setName('play')
            .setDescription('Plays a youtube video in voice')
            .addStringOption(option =>
                option.setName('query')
                    .setDescription('The video you want to search for.')
                    .setRequired(true)
                    .setMinLength(SEARCH_MIN_LENGTH)
                    .setAutocomplete(true)
            )
            .setDMPermission(false),
    name: "play",
    voice: true,
    guildOnly: true,
    usage: "play <query>",
    cooldown: 5,
    active: true,
    async autocomplete(interaction) {
        const searchTerm = interaction.options.getString('query');

        if (!searchTerm) {
            interaction.respond([{name: errors.no_search_term, value: "no_search_term"}]);
            return;
        }

        const results = await Youtube.search(searchTerm, 5);
        const autocompleteResults = [];

        const searchResults = new Map();
        results.forEach(result => {
            autocompleteResults.push({
                name: result.title,
                stream: result.stream,
                value: result.url
            });

            searchResults.set(result.url, result);
        });

        searches.set(interaction.commandId, searchResults);

        await interaction.respond(autocompleteResults);

    },
    async execute(interaction) {
        console.log('Play command executed.');
        console.log("Command ID:" + interaction.commandId);
        const query = interaction.options.getString('query');

        if (!query) {
            interaction.reply(errors.no_search_term);
            return;
        }
        else if (errors[query]) {
            interaction.reply(errors.filter(error => error.value === query)[0].name);
            return;
        }

        const videoInfo = searches.get(interaction.commandId).get(query);
        if (!videoInfo) {
            interaction.reply('No video was found with that query!');
            return;
        }

        // Check if user is connected to a voice channel
        if (!interaction.member.voice.channel) {
            interaction.reply('You need to be in a voice channel to use this command!');
            return;
        }

        if(!searches.has(interaction.commandId)) {
            interaction.reply('No option selected for that query!');
            return;
        }

        // Check if the youtubehandler has a queue for this guild
        if (!interaction.client.getVoiceHandler(interaction.guildId).getQueueHandler().hasQueue(interaction.guildId)) {
            // If not, create one and add it to the queuehandler
            interaction.client.getVoiceHandler(interaction.guildId).getQueueHandler().addQueue(interaction.guildId, new MusicQueue());
        }

        interaction.client.getVoiceHandler(interaction.guildId).getQueue().push(videoInfo.stream);

        console.log("Queue length: ", interaction.client.getVoiceHandler(interaction.guildId).getQueue().getLength());

        if (!interaction.client.getVoiceHandler(interaction.guildId).playing) {
            interaction.client.getVoiceHandler(interaction.guildId).play();
        }

        interaction.reply(`Added \`${videoInfo.title}\` to the queue!`);
    }
};