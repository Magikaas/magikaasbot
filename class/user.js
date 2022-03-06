class User {
    constructor(user) {
        this.user = user;
    }

    addRole(role) {
        console.log("Adding role: " + role.name);
        this.user.roles.add(role).catch(function(error) {
            console.log("Something went wrong assigning/removing '" + role.name + "' role.");
            console.log(error);
            console.log(error.message);
        });
    }

    removeRole(role) {
        this.user.roles.remove(role).catch(function(error) {
            console.log("Something went wrong assigning/removing '" + role.name + "' role.");
            console.log(error);
            console.log(error.message);
        });
    }
}

module.exports = User;