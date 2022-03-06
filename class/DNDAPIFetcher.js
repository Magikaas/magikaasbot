const https = require("https");
const HttpClient = require("../class/HttpClient");

class DNDAPIFetcher {
    constructor() {
        this._baseURL = "https://www.dnd5eapi.co/api/";
    }
    
    fetchSpell(spellName) {
        return this.fetch('spells', spellName.toLowerCase());
    }

    fetchSpells() {
        return this.fetch('spells', "");
    }

    fetch(type, name) {
        const regex = /\W+/;
        name = name.replace(regex, "-");

        const path = type + "/" + name;

        const httpClient = new HttpClient(this._baseURL, path);

        return httpClient.get();
    }
}

module.exports = DNDAPIFetcher;