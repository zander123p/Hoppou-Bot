module.exports = async (client, role) => {
    const { MessageEmbed } = require("discord.js");
    const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');
    const g = await role.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = role.guild.channels.cache.get(channelName);

    const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: 'ROLE_DELETE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Role Deleted')
        .addField('Role', roleMention(role))
        .setTimestamp();

    if (!channelLog) return c.send({ embeds: [me] });

    const { executor } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Role Deleted')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Role', roleMention(role.id))
        .setTimestamp();

    c.send({ embeds: [meU] });
};