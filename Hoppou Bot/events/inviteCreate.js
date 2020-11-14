module.exports = async (client, invite) => {
    const { MessageEmbed } = require("discord.js");
    const g = await invite.guild.ensure();
    const channelName = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    if (!channelName) return;
    const c = invite.guild.channels.cache.find(c => c.name === channelName);

    const fetchedLogs = await invite.guild.fetchAuditLogs({
        limit: 1,
        type: 'INVITE_CREATE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Invite Created')
        .addField('Invite', invite)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Invite Created')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Invite', invite)
        .setTimestamp();
    
    c.send(meU);
};