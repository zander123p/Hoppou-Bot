module.exports = async (client, role) => {
    const { MessageEmbed } = require("discord.js");
    const g = await role.guild.ensure();
    const channelName = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    if (!channelName) return;
    const c = role.guild.channels.cache.find(c => c.name === channelName);

    const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: 'ROLE_CREATE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Role Created')
        .addField('Role', role)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Role Created')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Role', role)
        .setTimestamp();
    
    c.send(meU);
};