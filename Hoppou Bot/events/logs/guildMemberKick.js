module.exports = async (client, member) => {
    const { MessageEmbed } = require("discord.js");
    const g = await member.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
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

    if (!channelLog) return c.send(me);

    const { executor } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Member Kicked')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Member', member.user)
        .addField('Reason', channelLog.reason)
        .setTimestamp();    

    c.send(meU);
};