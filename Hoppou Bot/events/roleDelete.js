module.exports = async (client, role) => {
    const { MessageEmbed } = require("discord.js");
    const g = await role.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = role.guild.channels.cache.get(channelName);

    const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: 'ROLE_DELETE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Role Deleted')
        .addField('Role', role)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor } = channelLog;

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Role Deleted')
        .setAuthor(executor.tag, executor.displayAvatarURL())
        .addField('Role', role)
        .setTimestamp();
    
    c.send(meU);
};