module.exports = async (client, guild, user, moderator) => {
    const { MessageEmbed } = require("discord.js");
    const g = await guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = guild.channels.cache.get(channelName);

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

    if (!channelLog) return c.send(me);

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
        .addField('Member', user)
        .addField('Reason', channelLog.reason)
        .setTimestamp();
    
    c.send(meU);

    // Handle ban in database

    const userProfile = await user.ensure();
    const mg = require('mongoose');
    const newActionId = mg.Types.ObjectId();
    const log = new client.ActionLogs({
        _id: newActionId,
        userID: user.id,
        guildID: guild.id,
        type: 'ban',
        moderator: executor.id,
        reason: channelLog.reason
    });
    await log.save();
    userProfile.bans.push(newActionId);
    userProfile.totalActions += 1;
    await userProfile.save();
};