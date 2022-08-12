const { EmbedBuilder } = require('discord.js');
const { getProfile } = require('@mineapi/sdk');
const axios = require('axios');

module.exports = {
    name: "profile",
    description: "Check a Minecraft account.",
    options: [
        {
            type: 3,
            name: "username",
            description: "The username of the account.",
            required: true,
        },
        {
            type: 3,
            name: "overlay",
            description: "Show skin as overlay?",
            required: true,
            choices: [
                {
                    name: "true",
                    value: "true",
                },
                {
                    name: "false",
                    value: "false",
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        try {
            await interaction.deferReply();
            const options = interaction.options._hoistedOptions[0];
            const cOptions = interaction.options.get("overlay");
            const data = await getProfile(options.value);
            let userNotFoundOptifine = false;
            let checkOptifine;
            const optifineCape = await axios.request({
                url: `https://api.mineapi.me/v1/cape/${data.name}?type=optifine`,
                headers: {
                    'Content-Type': 'application/json',   
                },
                method: 'GET',
            }).catch(err => { userNotFoundOptifine = true });
            if(!optifineCape) {
                checkOptifine = `Not found.`;
            } else {
                checkOptifine = `[Click](https://api.mineapi.me/v1/cape/${data.name}?type=optifine)`;
            }
            let userNotFoundMojang = false;
            let checkMojang;
            const mojangCape = await axios.request({
                url: `https://api.mineapi.me/v1/cape/${data.name}?type=mojang`,
                headers: {
                    'Content-Type': 'application/json',   
                },
                method: 'GET',
            }).catch(err => { userNotFoundMojang = true });
            if(!mojangCape) {
                checkMojang = `Not found.`;
            } else {
                checkMojang = `[Click](https://api.mineapi.me/v1/cape/${data.name}?type=mojang)`;
            }

            const Embed = new EmbedBuilder()
            .setColor(client.customColor)
            .setDescription(`• User's name is \`${data.name} (${data.name.length} characters)\`\n• User's UUID is \`${replaceUUID(data.id)}\`\n• User's MineAPI URL is [\`Click\`](https://mineapi.me/skin/${data.name})`)
            .setAuthor({ name: data.name, iconURL: 'https://api.mineapi.me/v1/head/'+ data.name +'?overlay='+ cOptions.value +'' })
            .setThumbnail('https://api.mineapi.me/v1/bust/'+ data.name +'?overlay='+ cOptions.value +'')
            .addFields(
                { name: 'Download skin', value: '[Click](https://api.mineapi.me/v1/download/skin/'+ data.name +')', inline: true },
                { name: 'User cape', value: `Optifine: ${checkOptifine}\nMojang: ${checkMojang}`, inline: true },
                { name: 'Is slim', value: data.appereance.slim == true ? "Yes" : "No", inline: true },
                { name: 'Color average', value: `Hex: [${data.appereance.skin.colorAverage.hex}](https://mineapi.me)\nRGB: [${data.appereance.skin.colorAverage.rgb}](https://mineapi.me)`, inline: true },
                { name: 'MineAPI claimed', value: `${data.claimed == true ? "Claimed" : "Not claimed"}`, inline: true },
                { name: 'MineAPI downloads', value: `${data.downloads}`, inline: true },
                { name: 'Head command: \> 1.13', value: `\`\`\`/give @s minecraft:player_head{SkullOwner:"${data.name}"}\`\`\``},
                { name: 'Head command: \< 1.12', value: `\`\`\`/give @p minecraft:skull 1 3 {SkullOwner:"${data.name}"}\`\`\``}
            )
            await interaction.followUp({
                embeds: [ Embed ]
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