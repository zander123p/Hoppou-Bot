module.exports = {
    eventType: 'guildMemberRemove',
    async event(client, member) {
        const g = await member.guild.ensure();

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });

        const channelLog = fetchedLogs.entries.first();

        if (!channelLog) return;

        const oldLog = g.oldLogs.find(C => { if(channelLog.id === C.id) return C; });
        if (oldLog) return;

        const pos = g.oldLogs.findIndex(C => { if(C.log === 'member leave') return C; });
        if (pos < 0) {
            g.oldLogs.push({ id: channelLog.id.toString(), log: 'member leave' });
        } else {
            g.oldLogs[pos].id = channelLog.id.toString();
        }

        await g.save();

        client.emit('guildMemberKick', member);
    },
};