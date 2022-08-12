const Client = require('./mineapi.js');
const config = require('../../config.mineapi.js');
const Modals = require('discord-modals');
const client = global.client = new Client({ intents: config.client.intents });
Modals(client);

//run client
client.run();