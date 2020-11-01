module.exports = async (client, guild, user) => {
    const { MessageEmbed } = require("discord.js");
    const g = await guild.ensure();
    const channelName = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    if (!channelName) return;
    const c = guild.channels.cache.find(c => c.name === channelName);

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_REMOVE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Member Unbanned')
        .addField('Member', user.tag)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Member Unbanned')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Member', user)
        .setTimestamp();
    
    c.send(meU);
};