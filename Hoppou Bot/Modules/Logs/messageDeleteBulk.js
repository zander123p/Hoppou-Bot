module.exports = {
    name: 'Channel Purged',
    eventType: 'messageDeleteBulk',
    async event(client, messages, moderator) {
        const { MessageEmbed } = require('discord.js');
        const { channelMention } = require('@discordjs/builders');

        const guild = messages.first().guild;
        const logs = await guild.getModuleSetting(this.module, 'logs');
        if (!logs) return;
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        const c = guild.channels.cache.get(log.id);

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_BULK_DELETE',
        });

        const channelLog = fetchedLogs.entries.first();

        const channel = messages.first().channel;

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Message Purge')
            .addField('Channel', channelMention(channel.id))
            .addField('Number of Messages Deleted', messages.size - 1)
            .setTimestamp();

        if (!channelLog) return c.send({ embeds: [me] });

        const { executor } = channelLog;

        if (executor.id === client.user.id && !moderator) {
            return;
        }

        if (!moderator)
            moderator = executor;

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Message Purge')
            .setAuthor(moderator.tag, moderator.displayAvatarURL())
            .addField('Channel', channelMention(channel.id))
            .addField('Number of Messages Deleted', messages.size - 1)
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};