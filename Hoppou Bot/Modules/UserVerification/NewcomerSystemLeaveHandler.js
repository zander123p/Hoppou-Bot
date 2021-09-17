module.exports = {
    eventType: 'guildMemberRemove',
    async event(client, member) {
        const user = await client.GuildNewJoins.findOne({ userID: member.id, guildID: member.guild.id });
        if (user) {
            const newcomerChannel = await member.guild.getModuleSetting(this.module, 'newcomer_channel');
            const channel = member.guild.channels.cache.get(newcomerChannel);
            const message = await channel.messages.fetch(user.messageID);
            message.delete();
            await client.GuildNewJoins.findOneAndDelete({ messageID: message.id });
        }
    },
};