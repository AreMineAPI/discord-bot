module.exports = {
  name: "ping",
  description: "Ping Pong!",
  options: [],
  run: async (client, interaction) => {
    await interaction.reply({
        content: ':ping_pong: **|** Pong! '+ client.ws.ping +'ms.',
    });
  },
};
