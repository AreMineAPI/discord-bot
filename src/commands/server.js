const { EmbedBuilder } = require('discord.js');
const { getServer } = require('@mineapi/sdk');
const axios = require('axios');

module.exports = {
    name: "server",
    description: "Check a Minecraft server.",
    options: [
        {
            type: 3,
            name: "address",
            description: "Write the adress.",
            required: true,
        },
    ],
    run: async (client, interaction) => {
        try {
            await interaction.deferReply();
            const options = interaction.options._hoistedOptions[0];
            const data = await getServer(options.value);
            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor(client.customColor)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setThumbnail(`https://api.mineapi.me/v1/icon/${data.hostname}`)
                    .addFields(
                        { name: "Adress", value: data.hostname, inline: true },
                        { name: "IP", value: `${data.ip}`, inline: true },
                        { name: "Players", value: `${data.players.online}/${data.players.max}`, inline: true },
                        { name: "Is online", value: data.online ? "Yes" : "No", inline: true },
                        { name: "Version", value: data.version, inline: true },
                        { name: "Icon", value: `[Click](https://api.mineapi.me/v1/icon/${data.hostname})`, inline: true },
                        { name: "Clean MOTD", value: `\`\`\`${data.motd.clean}\`\`\`` }
                    )
                ]
            });
        } catch(err) {
            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor("#E74C3C")
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setTitle("ERROR")
                    .setDescription(err.message === 'Request failed with status code 404' ? "Server not found." : err.message)
                ]
            });
            console.error(err);
        }
    },
  };