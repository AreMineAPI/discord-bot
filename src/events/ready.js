const { ActivityType } = require("discord.js");

module.exports = (client, config) => {
  client.on("ready", () => {
    client.user.setPresence({
      activities: [
        { name: config.client.presence.name, type: ActivityType.Playing },
      ],
      status: config.client.presence.status,
    });
  });
};
