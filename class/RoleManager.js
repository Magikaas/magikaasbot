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

    addRole(user, role) {
        user.roles.add(role).catch(function(error) {
            console.log("Something went wrong assigning/removing '" + role.name + "' role.");
            console.log(error);
            console.log(error.message);
        });
    }

    removeRole(user, role) {
        user.roles.remove(role).catch(function(error) {
            console.log("Something went wrong assigning/removing '" + role.name + "' role.");
            console.log(error);
            console.log(error.message);
        });
    }
}

module.exports = RoleManager;