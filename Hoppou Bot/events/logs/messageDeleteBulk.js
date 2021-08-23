module.exports = async (client, messages, moderator) => {
    const { MessageEmbed } = require("discord.js");
    const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');
    const guild = messages.first().guild;
    const g = await guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = guild.channels.cache.get(channelName);

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_BULK_DELETE',
    });

    const channelLog = fetchedLogs.entries.first();

    const channel = messages.first().channel;

    const me = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Message Purge')
        .addField('Channel', channelMention(channel.id))
        .addField('Number of Messages Deleted', messages.size - 1)
        .setTimestamp();

    if (!channelLog) return c.send({ embeds: [me] });

    const { executor } = channelLog;

    if (executor.id === client.user.id && !moderator) {
        return;
    }

    if (!moderator)
        moderator = executor;

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Message Purge')
        .setAuthor(moderator.tag, moderator.displayAvatarURL())
        .addField('Channel', channelMention(channel.id))
        .addField('Number of Messages Deleted', messages.size - 1)
        .setTimestamp();

    c.send({ embeds: [meU] });
};