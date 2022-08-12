module.exports = (client, config) => {
  client.on("guildDelete", async (guild) => {
    const channel = await client.channels.cache.get("1003266165923135508");
    await channel.send({
        content: `📕 **|** MineAPI \`${guild.name}\` sunucusundan çıkarıldı. \`${guild.memberCount} üye\``
    });
  });
};
