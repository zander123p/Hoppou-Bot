module.exports = async (client, channel) => {
    const { MessageEmbed } = require("discord.js");
    if (channel.type === 'dm') return;
    const guild = await channel.guild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = channel.guild.channels.cache.get(channelName);

    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_CREATE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Channel Created')
        .addField('Channel', channel)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor, target } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Channel Created')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Channel', channel)
        .setTimestamp();
    
    c.send(meU);
};