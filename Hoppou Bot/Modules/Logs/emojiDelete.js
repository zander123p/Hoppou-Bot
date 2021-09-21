module.exports = {
    name: 'Emoji Deleted',
    eventType: 'emojiDelete',
    async event(client, emoji) {
        const { MessageEmbed } = require('discord.js');

        const logs = await emoji.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = emoji.guild.channels.cache.get(log.id);

        const fetchedLogs = await emoji.guild.fetchAuditLogs({
            limit: 1,
            type: 'EMOJI_DELETE',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Emoji Deleted')
            .addField('Emoji', emoji.name)
            .setTimestamp();

        if (!channelLog) return c.send(me);

        const { executor } = channelLog;

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Emoji Deleted')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Emoji', emoji)
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};