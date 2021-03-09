module.exports = async (client, oldRole, newRole) => {
    const { MessageEmbed } = require("discord.js");
    const guild = await oldRole.guild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = oldRole.guild.channels.cache.get(channelName);

    const fetchedLogs = await oldRole.guild.fetchAuditLogs({
        limit: 1,
        type: 'ROLE_UPDATE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Role Updated')
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor, changes } = channelLog;

    if (oldRole.rawPosition != newRole.rawPosition) return;

    changes.forEach(change => {
        if(change.key === 'name') {
            let meU = new MessageEmbed()
                .setColor('#faea70')
                .setTitle('Role Name Updated')
                .setAuthor(executor.tag, executor.displayAvatarURL())
                .addField(`Role`, newRole)
                .addField(`Name`, `${change.old} -> ${change.new}`)
                .setTimestamp();
            c.send(meU);
        } else if (change.key === 'color') {
            let meU = new MessageEmbed()
                .setColor('#faea70')
                .setTitle('Role Colour Updated')
                .setAuthor(executor.tag, executor.displayAvatarURL())
                .addField(`Role`, newRole)
                .setTimestamp();
            c.send(meU);
        } else if (change.key === 'permissions') {
            let meU = new MessageEmbed()
                .setColor('#faea70')
                .setTitle('Role Permissions Updated')
                .setAuthor(executor.tag, executor.displayAvatarURL())
                .addField(`Role`, newRole)
                .setTimestamp();
            c.send(meU);
        }
    });
};