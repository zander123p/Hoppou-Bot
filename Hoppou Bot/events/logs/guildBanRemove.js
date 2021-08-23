module.exports = async (client, guild, user, moderator) => {
    const { MessageEmbed } = require("discord.js");
    const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');
    const g = await guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = guild.channels.cache.get(channelName);

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

    if (!channelLog) return c.send({ embeds: [me] });

    const { executor } = channelLog;

    if (executor.id === client.user.id && !moderator) {
        return;
    }

    if (!moderator)
        moderator = executor;

    const meU = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Member Unbanned')
        .setAuthor(moderator.tag, moderator.displayAvatarURL())
        .addField('Member', userMention(user.id))
        .setTimestamp();

    c.send({ embeds: [meU] });
};