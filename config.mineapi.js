const { IntentsBitField } = require('discord.js');

module.exports = {
    version: '1.0.4',
    client: {
        id: "",
        token: "",
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
        ],
        presence: {
            status: "online",
            name: "✨ Discover the beauties of Minecraft world.",
        }
    },
    database: {
        connect: ''
    },
    cmdDir: "./src/commands",
};