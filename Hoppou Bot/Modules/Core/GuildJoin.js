module.exports = {
    eventType: 'guildCreate',
    async event(client, guild) {
        await client.Guilds.findOneAndDelete({ guildID: guild.id });
    },
};