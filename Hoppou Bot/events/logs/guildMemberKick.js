module.exports = async (client, member, moderator) => {
    const { MessageEmbed } = require('discord.js');
    const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');
    const g = await member.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = member.guild.channels.cache.get(channelName);

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
        .addField('Reason', channelLog.reason)
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
};