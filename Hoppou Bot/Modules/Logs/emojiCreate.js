module.exports = {
    name: 'Emoji Created',
    eventType: 'emojiCreate',
    async event(client, emoji) {
        const { MessageEmbed } = require('discord.js');

        const logs = await emoji.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = emoji.guild.channels.cache.get(log.id);

        const fetchedLogs = await emoji.guild.fetchAuditLogs({
            limit: 1,
            type: 'EMOJI_CREATE',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#70f567')
            .setTitle('Emoji Created')
            .addField('Emoji', emoji)
            .setTimestamp();

        if (!channelLog) return c.send(me);

        const { executor } = channelLog;

        const meU = new MessageEmbed()
            .setColor('#70f567')
            .setTitle('Emoji Created')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Emoji', emoji)
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};