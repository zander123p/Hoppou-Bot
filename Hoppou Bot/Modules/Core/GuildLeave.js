module.exports = {
    eventType: 'guildDelete',
    async event(client, guild) {
        await client.Guilds.findOneAndDelete({ guildID: guild.id });
    },
};