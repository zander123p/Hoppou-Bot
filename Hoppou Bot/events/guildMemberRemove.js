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
        .setTitle('Member Left')
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .addField('Member', member.user)
        .setTimestamp();

    let oldLog = g.oldLogs.find(c => { if(channelLog.id === c.id) return c; });
    if (oldLog) return c.send(me);

    pos = g.oldLogs.findIndex(c => { if(c.log === module.exports.id) return c; });
    if (pos < 0) {
        g.oldLogs.push({id: channelLog.id.toString(), log: module.exports.id});
    } else {
        g.oldLogs[pos].id = channelLog.id.toString();
    }
    
    await g.save();

    c.send(me);
    client.emit('guildMemberKick', member);
};