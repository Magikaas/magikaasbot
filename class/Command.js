class Command {
    
    constructor(command, args, message, client, voiceChannel = false) {
        this.command = command;
        this.args = args;
        this.message = message;
        this.client = client;
        this.voiceChannel = voiceChannel;
    }

    run() {
        if (!this.command) {
            this.message.reply("That command could not be found. Type `" + this.client.prefix + " commands` to see this bot's commands.");
            return;
        }
    
        // Admin only means admin only
        if (this.isAdminCommand() && !this.client.RoleManager.senderIsAdmin(message)) return;
    
        let hasRole = false;
    
        if (this.command.requiredRoles) {
            for (const role of command.requiredRoles) {
                // If we have any of the required roles (requiredRoles is an OR list) run the command.
                if (this.client.RoleManager.senderHasRoleWithName(message, role)) {
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
    
        // Playing means this command should only be run if the bot is currently playing a song in voice.
        if (this.onlyDuringVoiceActivity()) {
            const guildId = this.message.guild.id;
            
            if (!this.client.getVoiceHandler(guildId).isInVoice()) {
                this.message.reply("The bot is not currently connected to any voice channels.");
                return false;
            }
    
            if (!this.client.ytQueueHandler.isPlaying()) {
                this.message.reply("The bot is not currently playing in voice chat.");
                return false;
            }
    
            this.runCommand();
        }
        else {
            this.runCommand();
        }
    }

    runCommand() {
        const guildId = this.message.guild.id;

        let voiceHandler = this.client.getVoiceHandler(guildId);
    
        if (!voiceHandler) {
            this.client.addVoiceHandler(guildId, this.client);
        }
    
        if (this.isVoiceCommand() && !this.client.getVoiceHandler(guildId).isConnected()) {
            let voiceChannel = this.voiceChannel ? this.voiceChannel : this.message.member.voice.channel;

            // If we still don't have a provided voice channel, check if we're connected to one instead
            if (!voiceChannel) {
                if (this.client.getVoiceHandler(guildId).getCurrentVoiceChannel()) {
                    voiceChannel = this.client.getVoiceHandler(guildId).getCurrentVoiceChannel();
                    this.client.getVoiceHandler(guildId).setChannel(voiceChannel);
                }
            }
    
            if (!voiceChannel && this.isVoiceRequired()) {
                return this.message.channel.send("You need to be in a voice channel to play music!");
            }
    
            const permissions = voiceChannel.permissionsFor(this.message.client.user);
        
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
              return this.message.channel.send("I need the permissions to join and speak in your voice channel!");
            }
    
            this.client.getVoiceHandler(guildId).setChannel(voiceChannel);
            this.client.getVoiceHandler(guildId).connect().then(connection => {
                if (connection) {
                    this.client.getVoiceHandler(guildId).setConnection(connection);
                    this.execute();
                }
                else {
                    console.log("Unable to run voice command, no connection detected");
                }
            });
        }
        else {
            this.execute();
        }
    }

    execute() {
        try {
            this.command.execute(this.message, this.args);
        }
        catch (error) {
            console.log(error);
            this.message.reply("There was an error trying to execute command: '" + this.getCommandName() + "'.");
            // message.reply("Error: " + error.message);
        }
    }

    getCommandName() {
        return this.command.name;
    }

    isVoiceCommand() { 
        return !!this.command.voice;
    }

    isVoiceRequired() {
        return !!this.command.voicereq;
    }

    isAdminCommand() {
        return !!this.command.admin;
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