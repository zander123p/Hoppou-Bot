module.exports = async (client, channel, time) => {
    const guild = await channel.guild.ensure();
    const channelName = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    const c = channel.guild.channels.cache.find(c => c.name === channelName);
    if (!c) return;

    const { MessageEmbed } = require("discord.js");
    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_PIN',
    });
    const fetchedLogs2 = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_UNPIN',
    });

    const channelLog = fetchedLogs.entries.first();
    const channelLog2 = fetchedLogs2.entries.first();

    const me = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Channel Pins Update')
        .addField('Channel', channel)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor } = channelLog;
    const { messageID } = channelLog.extra;
    const executor2 = channelLog2.executor;
    const messageID2 = channelLog2.extra.messageID;

    let pinMessage;
    await channel.messages.fetchPinned().then(msgs => pinMessage = msgs.first());
    let message;
    await channel.messages.fetch(messageID).then(msg => message = msg);
    let message2;
    await channel.messages.fetch(messageID2).then(msg => message2 = msg);

    const meUP = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Channel Pins Update - Message Pinned')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Channel', channel)
        .addField('Message', message.content)
        .addField('Jump', `https://discordapp.com/channels/${channel.guild.id}/${channel.id}/${message.id}`)
        .setTimestamp();

    const meU = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Channel Pins Update - Message Un-Pinned')
        .setAuthor(executor2.tag, executor2.displayAvatarURL())
        .addField('Channel', channel)
        .addField('Message', message2.content)
        .addField('Jump', `https://discordapp.com/channels/${channel.guild.id}/${channel.id}/${message2.id}`)
        .setTimestamp();
        
    if (pinMessage.id == messageID)
        c.send(meUP);
    else
        c.send(meU);
};