module.exports = async (client, oldEmoji, newEmoji) => {
    const { MessageEmbed } = require("discord.js");
    const guild = await oldEmoji.guild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = oldEmoji.guild.channels.cache.get(channelName);

    const fetchedLogs = await oldEmoji.guild.fetchAuditLogs({
        limit: 1,
        type: 'EMOJI_UPDATE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Emoji Updated')
        .addField('Emoji', `${oldEmoji.name} -> ${newEmoji.name}`)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Emoji Updated')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Emoji', `${oldEmoji.name} -> ${newEmoji.name}`)
        .setTimestamp();
    
    c.send(meU);
};