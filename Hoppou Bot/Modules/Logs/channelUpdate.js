module.exports = {
    name: 'Channel Changed',
    eventType: 'channelUpdate',
    async event(client, oldChannel, newChannel) {
        const { MessageEmbed } = require('discord.js');
        const { channelMention } = require('@discordjs/builders');

        if (oldChannel.type === 'dm') return;
        const logs = await newChannel.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = newChannel.guild.channels.cache.get(log.id);

        const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_UPDATE',
        });

        const channelLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#faea70')
            .setTitle('Channel Updated')
            .addField('Channel', channelMention(newChannel.id))
            .setTimestamp();

        if (!channelLog) return c.send({ embeds: [me] });

        const { executor, changes } = channelLog;
        if (channelLog.target.id === newChannel.id)
        {
            changes.forEach(change => {
                const meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle(`Channel Updated - ${correctKey(change.key)}`)
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Channel', channelMention(newChannel.id))
                    .addField('Old', change.old)
                    .addField('New', change.new)
                    .setTimestamp();
                c.send(meU);
            });
        } else if (oldChannel.rawPosition != newChannel.rawPosition) {
            // const meU = new MessageEmbed()
            //     .setColor('#faea70')
            //     .setTitle('Channel Updated')
            //     .setAuthor(executor.tag, executor.displayAvatarURL())
            //     .addField('Channel', channelMention(newChannel.id))
            //     .addField('Change - Position', `${oldChannel.rawPosition} -> ${newChannel.rawPosition}`)
            //     .setTimestamp();
            // c.send(meU);
        }
        // TODO: Add permission override
    },
};

function correctKey(key) {
    switch (key) {
        case 'name':
            return 'Name';
        case 'position':
            return 'Position';
        case 'topic':
            return 'Topic';
        case 'bitrate':
            return 'Bitrate';
        case 'permission_overwrites':
            return 'Permission Overwrites';
        case 'nsfw':
            return 'NSFW';
        case 'application_id':
            return 'Application ID';
        case 'rate_limit_per_user':
            return 'Slowmode Rate';
    }
}