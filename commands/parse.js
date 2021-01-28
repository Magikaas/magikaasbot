const StellarisParser = require("../class/StellarisParser");

module.exports = {
    name: "parse",
    description: "Command description",
    async execute(message, args) {
        const parser = new StellarisParser.StellarisParser(message.client);
        const a = parser.parse("data/testfile.stellaris");

        console.log(a);
    }
};
