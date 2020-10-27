module.exports = async (client, channel) => {
    const { MessageEmbed } = require("discord.js");
    const guild = await channel.guild.ensure();
    const channelName = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    const c = channel.guild.channels.cache.find(c => c.name === channelName);
    if (!c) return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_DELETE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Channel Deleted')
        .addField('Channel', channel.name)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor, target } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Channel Deleted')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Channel', channel.name)
        .setTimestamp();
    
    c.send(meU);
};