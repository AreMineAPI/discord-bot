const { EmbedBuilder } = require('discord.js');
const { getProfile } = require('@mineapi/sdk');
const axios = require('axios');

module.exports = {
    name: "body",
    description: "Check a Minecraft account body.",
    options: [
        {
            type: 3,
            name: "username",
            description: "The username of the account.",
            required: true,
        },
    ],
    run: async (client, interaction) => {
        try {
            await interaction.deferReply();
            const options = interaction.options._hoistedOptions[0];
            const data = await getProfile(options.value);
            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor(client.customColor)
                    .setAuthor({ name: data.name, iconURL: `https://api.mineapi.me/v1/head/${data.name}` })
                    .setImage(`https://api.mineapi.me/v1/body/${data.name}`)
                ]
            });
        } catch(err) {
            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("#E74C3C")
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setTitle("ERROR")
                    .setDescription(err.message === 'Request failed with status code 404' ? "User not found." : err.message)
                ]
            });
            console.error(err);
        }
    },
  };