module.exports = {
    name: 'Invite Created',
    eventType: 'inviteCreate',
    async event(client, invite) {
        const { MessageEmbed } = require('discord.js');

        const logs = await invite.guild.getModuleSetting(this.module, 'logs');
        if (!logs) return;
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        const c = invite.guild.channels.cache.get(log.id);

        const fetchedLogs = await invite.guild.fetchAuditLogs({
            limit: 1,
            type: 'INVITE_CREATE',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#70f567')
            .setTitle('Invite Created')
            .addField('Invite', invite.url)
            .setTimestamp();

        if (!channelLog) return c.send(me);

        const { executor } = channelLog;

        const meU = new MessageEmbed()
            .setColor('#70f567')
            .setTitle('Invite Created')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Invite', invite.url)
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};