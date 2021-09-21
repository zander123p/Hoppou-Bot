module.exports = {
    name: 'Emoji Changed',
    eventType: 'emojiUpdate',
    async event(client, oldEmoji, newEmoji) {
        const { MessageEmbed } = require('discord.js');

        const logs = await newEmoji.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = newEmoji.guild.channels.cache.get(log.id);

        const fetchedLogs = await oldEmoji.guild.fetchAuditLogs({
            limit: 1,
            type: 'EMOJI_UPDATE',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#faea70')
            .setTitle('Emoji Updated')
            .addField('Emoji', `${oldEmoji.name} -> ${newEmoji.name}`)
            .setTimestamp();

        if (!channelLog) return c.send(me);

        const { executor } = channelLog;

        const meU = new MessageEmbed()
            .setColor('#faea70')
            .setTitle('Emoji Updated')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Old', oldEmoji.name)
            .addField('New', newEmoji.name)
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};