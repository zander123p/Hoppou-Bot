module.exports = async (client, member) => {
    const { MessageEmbed } = require("discord.js");
    const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');
    const g = await member.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
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
        .addField('Member', userMention(member.user.id))
        .setTimestamp();

    if (!channelLog) return c.send({ embeds: [me] });

    const oldLog = g.oldLogs.find(C => { if(channelLog.id === C.id) return C; });
    if (oldLog) return c.send({ embeds: [me] });

    const pos = g.oldLogs.findIndex(C => { if(C.log === module.exports.id) return C; });
    if (pos < 0) {
        g.oldLogs.push({ id: channelLog.id.toString(), log: module.exports.id });
    } else {
        g.oldLogs[pos].id = channelLog.id.toString();
    }

    await g.save();

    c.send({ embeds: [me] });
    client.emit('guildMemberKick', member);

    await client.GuildUsers.findOneAndDelete({ userID: member.user.id, guildID: member.guild.id });
};