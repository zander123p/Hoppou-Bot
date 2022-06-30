module.exports = {
    name: 'Channel Deleted',
    eventType: 'channelDelete',
    async event(client, channel) {
        const { MessageEmbed } = require('discord.js');
        if (channel.type === 'dm') return;
        const logs = await channel.guild.getModuleSetting(this.module, 'logs');
        if (!logs) return;
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));

        const c = channel.guild.channels.cache.get(log.id);

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_DELETE',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Channel Deleted')
            .addField('Channel', channel.name)
            .setTimestamp();

        if (!channelLog) return c.send(me);

        const { executor } = channelLog;

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Channel Deleted')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Channel', channel.name)
            .setTimestamp();

            c.send({ embeds: [meU] });
    },
};