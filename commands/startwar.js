module.exports = {
    name: "startwar",
    description: "Command description",
    async execute(message, args) {
        let warMessage = await message.channel.send("War message");

        warMessage.react('✅');

        try {
            await awaitWarReactions(message, warMessage);
        }
        catch (e) {
            console.log(r);
        }
    }
};

async function awaitWarReactions(message, warMessage) {
    let filter = (reaction, user) => !user.bot;

    let options = {max: 1, time: 2500, errors: ['time']};

    console.log("Listening");

    warMessage.awaitReactions(filter, options)
    .then((collected) => {
        let reaction = collected.last();
        
        let reactionUser = reaction.users.cache.last();

        let response = "<@" + reactionUser.id + ">";

        message.channel.send(response);

        awaitWarReactions(message, warMessage);
    })
    .catch(collected => {
        awaitWarReactions(message, warMessage);
    });
}
