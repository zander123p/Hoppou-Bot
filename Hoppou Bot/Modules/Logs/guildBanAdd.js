module.exports = {
    name: 'Member Banned',
    eventType: 'guildBanAdd',
    async event(client, ban, moderator) {
        const { MessageEmbed } = require('discord.js');
        const { userMention } = require('@discordjs/builders');

        const guild = ban.guild;
        const user = ban.user;

        const logs = await guild.getModuleSetting(this.module, 'logs');
        if (!logs) return;
        const lo = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        const c = guild.channels.cache.get(lo.id);

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Member Banned')
            .addField('Member', user.tag)
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
            .setTitle('Member Banned')
            .setAuthor(moderator.tag, moderator.displayAvatarURL())
            .addField('Member', userMention(user.id))
            .addField('Reason', (channelLog.reason) ? channelLog.reason : 'No given reason')
            .setTimestamp();

        c.send({ embeds: [meU] });

        // Handle ban in database

        const userProfile = await user.ensure();
        const mg = require('mongoose');
        const newActionId = mg.Types.ObjectId();
        const log = new client.ActionLogs({
            _id: newActionId,
            userID: user.id,
            guildID: guild.id,
            type: 'ban',
            moderator: moderator.id,
            reason: channelLog.reason,
        });
        await log.save();
        userProfile.bans.push(newActionId);
        userProfile.totalActions += 1;
        await userProfile.save();
    },
};