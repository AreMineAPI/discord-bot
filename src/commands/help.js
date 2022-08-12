const { EmbedBuilder } = require('discord.js');
const config = require('../../config.mineapi.js');

module.exports = {
    name: "help",
    description: "Get help on MineAPI.",
    options: [],
    run: async (client, interaction) => {
        await interaction.deferReply();
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setColor(client.customColor)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`✨ This bot is built with its own module [@mineapi/sdk](https://www.npmjs.com/package/@mineapi/sdk).`)
                .addFields(
                    { name: `All commands`, value: `\`\`\`${client.commands.map(x => x.name).filter(x => x.name != 'help').join(", ")}\`\`\`` }
                )
                .setFooter({ text: `mineapi.me | ${config.version}`, iconURL: client.user.avatarURL() })
                .setTimestamp()
            ]
        });
    },
  };
  