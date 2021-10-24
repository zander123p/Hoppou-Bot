module.exports = {
    name: 'Invite Deleted',
    eventType: 'inviteDelete',
    async event(client, invite) {
        const { MessageEmbed } = require('discord.js');

        const logs = await invite.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = invite.guild.channels.cache.get(log.id);

        const fetchedLogs = await invite.guild.fetchAuditLogs({
            limit: 1,
            type: 'INVITE_DELETE',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Invite Deleted')
            .addField('Invite', invite.url)
            .setTimestamp();

        if (!channelLog) return c.send(me);

        const { executor } = channelLog;

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Invite Deleted')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Invite', invite.url)
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};