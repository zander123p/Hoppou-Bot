module.exports = {
    name: 'Member Kicked',
    eventType: 'guildMemberKick',
    async event(client, member, moderator) {
        const { MessageEmbed } = require('discord.js');
        const { userMention } = require('@discordjs/builders');

        const logs = await member.guild.getModuleSetting(this.module, 'logs');
        const lo = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!lo) return;
        const c = member.guild.channels.cache.get(lo.id);

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Member Kicked')
            .addField('Member', member.user.tag)
            .setTimestamp();

        if (!channelLog) return c.send({ embeds: [me] });

        const { executor } = channelLog;

        if (executor.id === client.user.id && !moderator) {
            return;
        }

        if (!moderator)
            moderator = executor;

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Member Kicked')
            .setAuthor(moderator.tag, moderator.displayAvatarURL())
            .addField('Member', userMention(member.user.id))
            .addField('Reason', (channelLog.reason) ? channelLog.reason : 'No given reason')
            .setTimestamp();

        c.send({ embeds: [meU] });

        // Handle ban in database

        const userProfile = await member.user.ensure();
        const mg = require('mongoose');
        const newActionId = mg.Types.ObjectId();
        const log = new client.ActionLogs({
            _id: newActionId,
            userID: member.id,
            guildID: member.guild.id,
            type: 'kick',
            moderator: moderator.id,
            reason: channelLog.reason,
        });
        await log.save();
        userProfile.kicks.push(newActionId);
        userProfile.totalActions += 1;
        await userProfile.save();
    },
};