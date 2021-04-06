module.exports = {
    eventType: 'guildMemberRemove',
    async event(client, member) {
        const g = await member.guild.ensure();

        const user = await client.GuildNewJoins.findOne({ userID: member.id, guildID: member.guild.id });
        if (user) {
            const channel = member.guild.channels.cache.get(g.settings.newcommerChannel);
            const message = await channel.messages.fetch(user.messageID);
            message.delete();
            await client.GuildNewJoins.findOneAndDelete({ messageID: message.id });
        }
    }
}