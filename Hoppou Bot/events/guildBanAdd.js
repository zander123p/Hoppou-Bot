module.exports = async (client, guild, user) => {
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

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Member Banned')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Member', user)
        .addField('Reason', channelLog.reason)
        .setTimestamp();
    
    c.send(meU);
};