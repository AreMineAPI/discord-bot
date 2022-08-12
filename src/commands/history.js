const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const axios = require('axios');
const moment = require('moment');

module.exports = {
    name: "history",
    description: "Username history.",
    options: [
        {
            type: 3,
            name: "user",
            description: "The username of the account.",
            required: true,
        }
    ],
    run: async (client, interaction) => {
        try {
            const options = interaction.options.get("user").value;
            let data = await axios.request({
                url: `https://api.mineapi.me/v1/user/${options}/profile?external=nameHistory`,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            const cat = data.data.data.nameHistory.filter(x => x.changedToAt).length;
            if(cat === 0) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Red')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setTitle("ERROR")
                    .setDescription("No history found.")
                ]
            });

            let page = 1;
            const per_page = 10;
            const max_page = Math.ceil(data.data.data.nameHistory.length / per_page);
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${options}'s name history`, iconURL: "https://api.mineapi.me/v1/head/" + options })
                .setColor(client.customColor)
                .setDescription(`${data.data.data.nameHistory.filter(x => x.changedToAt).sort((a,b) => b.changedToAt - a.changedToAt).slice((page - 1) * per_page, (page) * per_page).map((x, i) => `\`${i + 1}.\` ${x.name} <t:${Math.floor(x.changedToAt / 1000)}:R>`).join('\n')}`)
                .setFooter({ text: `Page ${page} of ${max_page}` })
                .setThumbnail(`https://api.mineapi.me/v1/bust/${options}?overlay=false`)
                .setTimestamp();

                
            interaction.reply({
                embeds: [embed],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setEmoji('1003024424083144805')
                                .setCustomId("prev")
                                .setDisabled(page === 1)
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setLabel(`${page}/${max_page}`)
                                .setCustomId("none")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setEmoji('1003024706879893544')
                                .setCustomId("next")
                                .setDisabled(page === max_page)
                                .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                .setEmoji('1003031126228619274')
                                .setCustomId("delete")
                                .setStyle(ButtonStyle.Danger)
                        )
                ]

            });

            const filter = i => i.user.id === interaction.user.id;

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });


            collector.on('collect', async i => {
                if(i.customId === "delete") {
                    collector.stop();
                    await interaction.deleteReply();
                }
                if (i.customId === "prev") {
                    console.log(page)
                    if (page > 1) {
                        page--;
                        embed.setDescription(`${data.data.data.nameHistory.filter(x => x.changedToAt).sort((a,b) => b.changedToAt - a.changedToAt).slice((page - 1) * per_page, (page) * per_page).map((x, i) => `\`${(page-1) * per_page + i+1}.\` ${x.name} <t:${Math.floor(x.changedToAt / 1000)}:R>`).join('\n')}`);
                        embed.setFooter({ text: `Page ${page} of ${max_page}` });
                        i.update({ 
                            embeds: [embed],
                            components: [
                                new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setEmoji('1003024424083144805')
                                            .setCustomId("prev")
                                            .setDisabled(page === 1)
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setLabel(`${page}/${max_page}`)
                                            .setCustomId("none")
                                            .setDisabled(true)
                                            .setStyle(ButtonStyle.Secondary),
                                        new ButtonBuilder()
                                            .setEmoji('1003024706879893544')
                                            .setCustomId("next")
                                            .setDisabled(page === max_page)
                                            .setStyle(ButtonStyle.Success),
                                            new ButtonBuilder()
                                            .setEmoji('1003031126228619274')
                                            .setCustomId("delete")
                                            .setStyle(ButtonStyle.Danger)
                                    )
                            ]
                        });
                    }
                } else if (i.customId === "next") {
                    if (page < max_page) {
                        page++;
                        embed.setDescription(`${data.data.data.nameHistory.filter(x => x.changedToAt).sort((a,b) => b.changedToAt - a.changedToAt).slice((page - 1) * per_page, (page) * per_page).map((x, i) => `\`${(page-1) * per_page + i+1}.\` ${x.name} <t:${Math.floor(x.changedToAt / 1000)}:R>`).join('\n')}`);
                        embed.setFooter({ text: `Page ${page} of ${max_page}` });
                        i.update({ 
                            embeds: [embed],
                            components: [
                                new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setEmoji("1003024424083144805")
                                            .setCustomId("prev")
                                            .setDisabled(page === 1)
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setLabel(`${page}/${max_page}`)
                                            .setCustomId("none")
                                            .setDisabled(true)
                                            .setStyle(ButtonStyle.Secondary),
                                        new ButtonBuilder()
                                            .setEmoji("1003024706879893544")
                                            .setCustomId("next")
                                            .setDisabled(page === max_page)
                                            .setStyle(ButtonStyle.Success),
                                            new ButtonBuilder()
                                            .setEmoji('1003031126228619274')
                                            .setCustomId("delete")
                                            .setStyle(ButtonStyle.Danger)
                                    )
                            ]
                        });
                    }
                }
            });
        } catch (err) {
            await interaction.reply({
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
