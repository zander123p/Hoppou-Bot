module.exports = {
    name: 'Member Leave',
    eventType: 'guildMemberRemove',
    async event(client, member) {
        const { MessageEmbed } = require('discord.js');
        const { userMention } = require('@discordjs/builders');
        const g = await member.guild.ensure();

        const logs = await member.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = member.guild.channels.cache.get(log.id);

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Member Left')
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .addField('Member', userMention(member.user.id))
            .setTimestamp();

        if (!channelLog) return c.send({ embeds: [me] });

        const oldLog = g.oldLogs.find(C => { if(channelLog.id === C.id) return C; });
        if (oldLog) return c.send({ embeds: [me] });

        const pos = g.oldLogs.findIndex(C => { if(C.log === this.name.toLowerCase()) return C; });
        if (pos < 0) {
            g.oldLogs.push({ id: channelLog.id.toString(), log: this.name.toLowerCase() });
        } else {
            g.oldLogs[pos].id = channelLog.id.toString();
        }

        await g.save();

        client.emit('guildMemberKick', member);

        c.send({ embeds: [me] });

        await client.GuildUsers.findOneAndDelete({ userID: member.user.id, guildID: member.guild.id });
    },
};