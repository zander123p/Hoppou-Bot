module.exports = {
    name: 'Role Changed',
    eventType: 'roleUpdate',
    async event(client, oldRole, newRole) {
        const { MessageEmbed } = require('discord.js');
        const { roleMention } = require('@discordjs/builders');

        const logs = await newRole.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = newRole.guild.channels.cache.get(log.id);

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
                const meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Role Name Updated')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Role', roleMention(newRole.id))
                    .addField('Before', change.old)
                    .addField('After', change.new)
                    .setTimestamp();
                c.send({ embeds: [meU] });
            } else if (change.key === 'color') {
                const meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Role Colour Updated')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Role', roleMention(newRole.id))
                    .setTimestamp();
                c.send({ embeds: [meU] });
            } else if (change.key === 'permissions') {
                const meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Role Permissions Updated')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Role', roleMention(newRole.id))
                    .setTimestamp();
                c.send({ embeds: [meU] });
            }
        });
    },
};