module.exports = {
    name: 'Channel Created',
    eventType: 'channelCreate',
    async event(client, channel) {
        const { MessageEmbed } = require('discord.js');
        const { channelMention } = require('@discordjs/builders');

        if (channel.type === 'dm') return;
        const logs = await channel.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = channel.guild.channels.cache.get(log.id);

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_CREATE',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#70f567')
            .setTitle('Channel Created')
            .addField('Channel', channelMention(channel.id))
            .setTimestamp();

        if (!channelLog) return c.send(me);

        const { executor } = channelLog;

        const meU = new MessageEmbed()
            .setColor('#70f567')
            .setTitle('Channel Created')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Channel', channelMention(channel.id))
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};