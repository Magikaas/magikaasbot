class RoleManager {
    constructor() {}

    senderIsAdmin(message) {
        return this.senderHasRoleWithName(message.member, "admin");
    }

    senderHasRoleWithName(member, roleName) {
        let role = this.getRoleByName(member.guild, roleName);
        if (role) {
            return this.senderHasRole(member, role);
        }
        else {
            return false;
        }
    }
    
    senderHasRole(member, role) {
        return member.roles.cache.some(r => r.name === role.name);
    }
    
    getRoleByName(guild, roleName) {
        return guild.roles.cache.find(role => role.name === roleName);
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