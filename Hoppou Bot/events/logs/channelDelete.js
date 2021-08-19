module.exports = async (client, channel) => {
    const { MessageEmbed } = require("discord.js");
    if (channel.type === 'dm') return;
    const guild = await channel.guild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = channel.guild.channels.cache.get(channelName);

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

        c.send({ embeds: [meU] });
};