class Command {
    
    constructor(command, interaction, client) {
        this.command = command;
        this.interaction = interaction;
        this.client = client;
    }

    run() {
        if (!this.command) {
            this.interaction.reply("That command could not be found. Type `" + this.client.prefix + " commands` to see this bot's commands.");
            return;
        }
    
        // Admin only means admin only
        if (this.isAdminCommand() && !this.client.roleManager.senderIsAdmin(this.interaction)) return;
    
        let hasRole = false;
    
        if (this.command.requiredRoles) {
            for (const role of this.command.requiredRoles) { //issue here, not sure what
                // If we have any of the required roles (requiredRoles is an OR list) run the command.
                if (this.client.roleManager.senderHasRoleWithName(this.interaction.member, role)) {
                    hasRole = true;
                    break;
                }
            }
        }
        else {
            hasRole = true;
        }
    
        if (!hasRole) {
            this.interaction.reply("You lack the required permissions to execute this command");
            return;
        }
        const guildId = this.interaction.guild.id;
    
        // Playing means this command should only be run if the bot is currently playing a song in voice.
        if (this.onlyDuringVoiceActivity()) {
            if (!this.client.getVoiceHandler(guildId).isInVoice()) {
                this.interaction.reply("The bot is not currently connected to any voice channels.");
                return false;
            }
    
            if (!this.client.ytQueueHandler.isPlaying()) {
                this.interaction.reply("The bot is not currently playing in voice chat.");
                return false;
            }
    
            this.runCommand();
        }
        else {
            this.runCommand();
        }
    }

    runCommand() {
        const guildId = this.interaction.guild.id;

        let voiceHandler = this.client.getVoiceHandler(guildId);
    
        if (!voiceHandler) {
            this.client.addVoiceHandler(guildId, this.client);
        }
    
        if (this.command.voice && !this.client.getVoiceHandler(guildId).isConnected()) {
            const voiceChannel = this.interaction.member.voice.channel;
    
            if (!voiceChannel) {   
                return this.interaction.channel.send("You need to be in a voice channel to play music!");
            }
        
            // Check if the bot has permissions for this voice channel
            if (!voiceChannel.joinable || !voiceChannel.speakable) {
              return this.interaction.reply("I need the permissions to join and speak in your voice channel!");
            }

            // Check if the bot is already in the channel and if not, join it
            if (!this.client.getVoiceHandler(guildId).isInVoice()) {
                this.client.getVoiceHandler(guildId).setChannel(voiceChannel);
                this.client.getVoiceHandler(guildId).connect().then(connection => {
                    this.client.getVoiceHandler(guildId).setConnection(connection);
                    this.execute();
                });
            }
            else {
                this.execute();
            }
        }
        else {
            this.execute();
        }
    }

    execute() {
        try {
            this.command.execute(this.interaction);
        }
        catch (error) {
            console.log(error);
            this.interaction.reply("There was an error trying to execute command: '" + this.command.name + "'.");
            // message.reply("Error: " + error.message);
        }
    }

    async autocomplete() {
        try {
            await this.command.autocomplete(this.interaction);
        }
        catch (error) {
            console.error(error);
        }
    }

    isVoiceCommand() { 
        return !!this.command.voice;
    }

    isAdminCommand() {
        return !!this.command.adminOnly;
    }

    requiresRoles() {
        return !!this.command.requiredRoles;
    }

    getRequiredRoles() {
        return this.command.requiredRoles;
    }

    onlyDuringVoiceActivity() {
        return this.command.playing;
    }
}

module.exports = Command;