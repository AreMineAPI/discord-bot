const { EmbedBuilder } = require('discord.js');
const { getProfile } = require('@mineapi/sdk');
const axios = require('axios');

module.exports = {
    name: "uuid",
    description: "Check a Minecraft account UUID.",
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
                    .setThumbnail(`https://api.mineapi.me/v1/bust/${data.name}`)
                    .setAuthor({ name: data.name, iconURL: `https://api.mineapi.me/v1/head/${data.name}` })
                    .setDescription(`• Username: \`${data.name}\`\n• MineAPI URL: [\`https://mineapi.me/skin/${data.name}\`](https://mineapi.me/skin/${data.name})\n• Short UUID: \`${data.id}\`\n• Long UUID: \`${replaceUUID(data.id)}\` `)
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
  

  function replaceUUID(x) {
    const firstEight = x.substring(0, 8);
    const secondFour = x.substring(8, 12);
    const thirdFour = x.substring(12, 16);
    const fourthFour = x.substring(16, 20);
    const lastTwelve = x.substring(20, 32);

    return `${firstEight}-${secondFour}-${thirdFour}-${fourthFour}-${lastTwelve}`;
}