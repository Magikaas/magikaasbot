const DNDAPIFetcher = require("../class/DNDAPIFetcher");

module.exports = {
    name: "learn",
    description: "Let the AI learn",
    async execute(message, args) {
        const api = new DNDAPIFetcher();

        message.client.ai.trainingData = [];

        let trainingDataRecord = {};

        api.fetchSpells()
            .then((output) => {
                const jsonData = JSON.parse(output);

                for (let spellData of jsonData.results) {
                    const spellIndex = spellData.index;
                    let innerJsonData = {};

                    api.fetchSpell(spellIndex)
                        .then((spellInfoOutput) => {
                            try {
                                innerJsonData = JSON.parse(spellInfoOutput);
                            }
                            catch (e) {
                                console.log("Weird json?");
                                console.log(spellInfoOutput);
                                console.log(e);
                            }

                            const outputData = {};

                            for (let classData of innerJsonData.classes) {
                                outputData[classData.index] = 1;
                            }

                            trainingDataRecord = {
                                input: {
                                    [spellData.index.toLowerCase()]: 1
                                },
                                output: outputData
                            };
                            
                            message.client.ai.trainingData.push(trainingDataRecord);
                        });
                }

                message.reply("Learning");
            })
            .catch((error) => {
                console.log(error);
            });
    }
};
