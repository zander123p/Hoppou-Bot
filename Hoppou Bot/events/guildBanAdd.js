module.exports = async (client, guild, user) => {
    const { MessageEmbed } = require("discord.js");
    const g = await guild.ensure();
    const channelName = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    const c = guild.channels.cache.find(c => c.name === channelName);
    if (!c) return;

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
        .setTimestamp();
    
    c.send(meU);
};