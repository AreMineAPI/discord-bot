module.exports = (client, config) => {
  client.on("guildCreate", async (guild) => {
    const channel = await client.channels.cache.get("1003266165923135508");
    await channel.send({
        content: `📗 **|** MineAPI \`${guild.name}\` sunucusuna eklendi. \`${guild.memberCount} üye\``
    });
  });
};
