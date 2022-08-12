const { EmbedBuilder } = require('discord.js');
const config = require('../../config.mineapi.js');

module.exports = {
    name: "invite",
    description: "Invite a MineAPI bot.",
    options: [],
    run: async (client, interaction) => {
            await interaction.deferReply();
            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setColor(client.customColor)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .addFields(
                        { name: "Invite MineAPI", value: `[Click here](https://discord.com/api/oauth2/authorize?client_id=999784843955159100&permissions=8&scope=bot%20applications.commands)`, inline: true },
                        { name: "MineAPI Website", value: `[Click here](https://mineapi.me)`, inline: true },
                        { name: "MineAPI Support", value: `[Click here](https://discord.gg/rJ2G8YRVVa)`, inline: true },
                        { name: "MineAPI Github", value: `[Click here](https://github.com/AreMineAPI)`, inline: true }
                    )
                    .setFooter({ text: `powered by Redstone c: | ${config.version}`, iconURL: client.user.avatarURL() })
                    .setTimestamp()
                ]
            });
    },
  };