const { EmbedBuilder } = require('discord.js');
const config = require('../../config.mineapi.js');
const pingedModel = require('../models/pinged.js');
const mongoose = require('mongoose');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
    name: "info",
    description: "MineAPI info.",
    options: [],
    run: async (client, interaction) => {
        await interaction.deferReply();
        let uptime = moment.duration(client.uptime),
        UptimeFormat = (uptime).format(" D [days], H [hours], m [minutes], s [seconds]");
        let checkStatus;
        if(client.ws.ping < 90) {
            checkStatus = "Everything is okay";
        }
        if(client.ws.ping > 90) {
            checkStatus = "Oops, something is going wrong";
        }
        let $now = Date.now();
        const all = await pingedModel.find({});
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setColor(client.customColor)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .addFields(
                    {
                        name: "General Info",
                        value: `\`\`\`css
# [ Client ID ] => ${client.user.id}
# [ MineAPI Users ] => ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}
# [ MineAPI Guilds ] => ${client.guilds.cache.size.toLocaleString()}
# [ MineAPI Channels ] => ${client.channels.cache.size.toLocaleString()}\`\`\``
                    },
                    {
                        name: "MineAPI Info",
                        value: `\`\`\`css
# [ Uptime ] => ${UptimeFormat}
# [ Database Status ] => ${mongoose.STATES[mongoose.connection.readyState] === "connected" ? "Connected" : "Not Connected"}
# [ General Status ] => ${checkStatus}
# [ MineAPI Version ] => ${config.version}\`\`\``
                    },
                    {
                        name: "Ping Info",
                        value: `\`\`\`css
# [ MineAPI Ping ] => ${client.ws.ping}ms
# [ Database Ping ] => ${Date.now() - $now}ms\`\`\``
                    }
                )
                .setFooter({ text: `mineapi.me | ${config.version}`, iconURL: client.user.avatarURL() })
                .setTimestamp()
            ]
        });
    },
  };
  