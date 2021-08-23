module.exports = async (client, message) => {
    const { MessageEmbed } = require("discord.js");

    const guild = await message.guild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = message.guild.channels.cache.get(channelName);

    if (message.partial) {
        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });
    
        const deletionLog = fetchedLogs.entries.first();
        const { executor, target } = deletionLog;
        if (!deletionLog.extra.channel.guild) return;

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Unknown Message Deleted')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Message Author', `Unknown`)
            .addField('Channel', deletionLog.extra.channel)
            .setTimestamp();
        
        return c.send(meU);
    }

    if (message.author.bot || !message.guild) return;


    const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE',
    });

    const deletionLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Message Deleted')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .addField('Message Author', message.author)
        .addField('Channel', message.channel)
        .addField('Message', message.toString())
        .addField(`Jump to message`,`[Jump](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setTimestamp();

    if (!deletionLog) return c.send(me);

    let oldLog = guild.oldLogs.find(c => { if(deletionLog.id === c.id) return c; });
    if (oldLog) return c.send(me);

    pos = guild.oldLogs.findIndex(c => { if(c.log === module.exports.id) return c; });
    if (pos < 0) {
        guild.oldLogs.push({id: deletionLog.id.toString(), log: module.exports.id});
    } else {
        guild.oldLogs[pos].id = deletionLog.id.toString();
    }
    
    await guild.save();

    const { executor, target } = deletionLog;

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Message Deleted')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Message Author', message.author)
        .addField('Channel', message.channel)
        .addField('Message', message)
        .addField(`Jump to message`,`[Jump](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setTimestamp();
    
    c.send(meU);
};