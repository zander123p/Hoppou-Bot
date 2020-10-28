module.exports = async (client, member) => {
    const { MessageEmbed } = require("discord.js");
    const g = await member.guild.ensure();
    const channelName = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    const c = member.guild.channels.cache.find(c => c.name === channelName);
    let oldLog = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).oldLog;
    if (!c) return;

    const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Member Left')
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .addField('Member', member.user)
        .setTimestamp();

    if (channelLog.id === oldLog) return c.send(me);

    pos = g.settings.channels.findIndex(c => { if(c.logs.includes(module.exports.id)) return c; });
    g.settings.channels[pos].oldLog = channelLog.id.toString();
    
    await g.save();

    c.send(me);
    client.emit('guildMemberKick', member);
};