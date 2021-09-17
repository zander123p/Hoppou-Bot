module.exports = {
    eventType: 'guildMemberUpdate',
    async event(client, oldMember, newMember) {
        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const role = newMember.roles.cache.difference(oldMember.roles.cache);
            const newcommerRole = await oldMember.guild.getModuleSetting(this.module, 'newcomer_role');
            if (role.first().id === newcommerRole) {
                const msg = await client.GuildNewJoins.findOne({ userID: oldMember.id, guildID: oldMember.guild.id });
                const newcomerChannel = await oldMember.guild.getModuleSetting(this.module, 'newcomer_channel');
                const channel = oldMember.guild.channels.cache.get(newcomerChannel);
                let message;
                try {
                    message = await channel.messages.fetch(msg.messageID);
                } catch (err) {
                    return;
                }
                message.delete();
                await client.GuildNewJoins.findOneAndDelete({ messageID: message.id });
            }
        }
    },
};