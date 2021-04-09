module.exports = {
    eventType: 'guildMemberUpdate',
    async event(client, oldMember, newMember) {
        const g = await oldMember.guild.ensure();

        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const role = newMember.roles.cache.difference(oldMember.roles.cache);
            if (role.first().id === g.settings.newcommerRole) {
                const msg = await client.GuildNewJoins.findOne({ userID: oldMember.id, guildID: oldMember.guild.id })
                const channel = oldMember.guild.channels.cache.get(g.settings.newcommerChannel);
                const message = await channel.messages.fetch(msg.messageID);
                message.delete();
                await client.GuildNewJoins.findOneAndDelete({ messageID: message.id });
            }
        }
    }
};