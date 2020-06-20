class RoleManager {
    constructor() {}

    senderIsAdmin(message) {
        return this.senderHasRoleWithName(message, "admin");
    }
    
    senderHasRoleWithName(message, roleName) {
        return message.member.roles.cache.find(role => role.name === roleName);
    }
    
    getRoleByName(message, roleName) {
        return message.guild.roles.cache.find(role => role.name === roleName);
    }
}

module.exports = {
    RoleManager
}