return;
// const StellarisParser = require("../class/StellarisParser");
// const fs = require('fs');
// // import MyGrammarLexer from '../g4/paradoxgrammar/ParadoxFileLexer';
// // import MyGrammarParser from '../g4/paradoxgrammar/ParadoxFileParser';
// const MyGrammarLexer = require('../g4/paradoxgrammar/ParadoxFileLexer').ParadoxFileLexer;
// const MyGrammarParser = require('../g4/paradoxgrammar/ParadoxFileParser').ParadoxFileParser;
// const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('parse')
            .setDescription('Parse a stellaris file.')
            .addStringOption(option =>
                option.setName('filepath')
                    .setDescription('The file you want to parse.')
                    .setRequired(false)
            )
            .setDMPermission(false),
    name: "parse",
    voice: false,
    active: true,
    async execute(interaction) {
        console.log('Parse command executed.');
        // const parser = new StellarisParser.StellarisParser(message.client);
        // const a = parser.parse("data/testfile.stellaris");
        
        const filepath = interaction.options.getString('filepath');

        console.log(interaction.options);

        const config = ini.parse(fs.readFileSync(filepath ? filepath : "data/testfile.stellaris", 'utf-8'));

        console.log(config);

        console.log(config.achievement_total_control.id); // outputs 81
        console.log(config.achievement_total_control.localization); // outputs NEW_ACHIEVEMENT_7_21
        console.log(config.achievement_total_control.possible.NOT.num_of_custom_nations); // outputs 1
        console.log(config.achievement_total_control.provinces_to_highlight.owned_by); // outputs ROOT
        console.log(config.achievement_total_control.provinces_to_highlight.OR.NOT.unrest); // outputs 1
        console.log(config.achievement_total_control.happened.num_of_cities); // outputs 100

        interaction.reply(`Parsed \`${filepath.length > 0 ? filepath : "data/testfile.stellaris"}\`!`);
        // console.log(a);
    }
};
