module.exports = async (client, emoji) => {
    const { MessageEmbed } = require("discord.js");
    const guild = await emoji.guild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = emoji.guild.channels.cache.get(channelName);

    const fetchedLogs = await emoji.guild.fetchAuditLogs({
        limit: 1,
        type: 'EMOJI_CREATE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Emoji Created')
        .addField('Emoji', emoji)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Emoji Created')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Emoji', emoji)
        .setTimestamp();

    c.send({ embeds: [meU] });
};