module.exports = {
    name: 'Member Unbanned',
    eventType: 'guildBanRemove',
    async event(client, ban, moderator) {
        const { MessageEmbed } = require('discord.js');
        const { userMention } = require('@discordjs/builders');

        const guild = ban.guild;
        const user = ban.user;

        const logs = await guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = guild.channels.cache.get(log.id);

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#70f567')
            .setTitle('Member Unbanned')
            .addField('Member', user.tag)
            .setTimestamp();

        if (!channelLog) return c.send({ embeds: [me] });

        const { executor } = channelLog;

        if (executor.id === client.user.id && !moderator) {
            return;
        }

        if (!moderator)
            moderator = executor;

        const meU = new MessageEmbed()
            .setColor('#70f567')
            .setTitle('Member Unbanned')
            .setAuthor(moderator.tag, moderator.displayAvatarURL())
            .addField('Member', userMention(user.id))
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};