module.exports = async (client, member) => {
    const { MessageEmbed } = require("discord.js");
    const g = await member.guild.ensure();
    const channelName = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    if (!channelName) return;
    const c = member.guild.channels.cache.find(c => c.name === channelName);

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

    if (!channelLog) return c.send(me);

    const { executor } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Member Kicked')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Member', member.user)
        .setTimestamp();    

    c.send(meU);
};