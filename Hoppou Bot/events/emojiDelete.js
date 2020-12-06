module.exports = async (client, emoji) => {
    const { MessageEmbed } = require("discord.js");
    const guild = await emoji.guild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = emoji.guild.channels.cache.get(channelName);

    const fetchedLogs = await emoji.guild.fetchAuditLogs({
        limit: 1,
        type: 'EMOJI_DELETE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Emoji Deleted')
        .addField('Emoji', emoji.name)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor, target } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Emoji Deleted')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Emoji', emoji)
        .setTimestamp();
    
    c.send(meU);
};