module.exports = async (client, message) => {
    const { MessageEmbed } = require("discord.js");
    if (message.author.bot || !message.guild) return;
    const guild = await message.guild.ensure();
    const channelName = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    const channel = message.guild.channels.cache.find(c => c.name === channelName);
    if (!channel) return;

    const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE',
    });

    const deletionLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Message Deleted')
        .addField('Channel', message.channel)
        .addField('Message', message)
        .addField('Jump To Message',`https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
        .setTimestamp();

    if (!deletionLog) return channel.send(me);

    const { executor, target } = deletionLog;

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Message Deleted')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Channel', message.channel)
        .addField('Message', message)
        .addField('Jump To Message',`https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
        .setTimestamp();
    
    channel.send(meU);
};