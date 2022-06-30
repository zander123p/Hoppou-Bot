module.exports = {
    name: 'Role Deleted',
    eventType: 'roleDelete',
    async event(client, role) {
        const { MessageEmbed } = require('discord.js');
        const { roleMention } = require('@discordjs/builders');

        const logs = await role.guild.getModuleSetting(this.module, 'logs');
        if (!logs) return;
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        const c = role.guild.channels.cache.get(log.id);

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_DELETE',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Role Deleted')
            .addField('Role', roleMention(role))
            .setTimestamp();

        if (!channelLog) return c.send({ embeds: [me] });

        const { executor } = channelLog;

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Role Deleted')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Role', roleMention(role.id))
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};