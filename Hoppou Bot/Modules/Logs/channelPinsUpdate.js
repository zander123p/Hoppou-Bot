module.exports = {
    name: 'Channel Pins Updated',
    eventType: 'channelPinsUpdate',
    async event(client, channel) {
        if (channel.type === 'dm') return;
        const { channelMention } = require('@discordjs/builders');

        const logs = await channel.guild.getModuleSetting(this.module, 'logs');
        if (!logs) return;
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));

        const c = channel.guild.channels.cache.get(log.id);

        const { MessageEmbed } = require('discord.js');
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_PIN',
        });
        const fetchedLogs2 = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_UNPIN',
        });

        const channelLog = fetchedLogs.entries.first();
        const channelLog2 = fetchedLogs2.entries.first();

        const me = new MessageEmbed()
            .setColor('#faea70')
            .setTitle('Channel Pins Update')
            .addField('Channel', channelMention(channel.id))
            .setTimestamp();

        if (!channelLog) return c.send({ embeds: [me] });

        const { executor } = channelLog;
        const { messageID } = channelLog.extra;
        const executor2 = channelLog2.executor;
        const messageID2 = channelLog2.extra.messageID;

        let pinMessage;
        await channel.messages.fetchPinned().then(msgs => pinMessage = msgs.first());
        let message;
        await channel.messages.fetch(messageID).then(msg => message = msg);
        let message2;
        await channel.messages.fetch(messageID2).then(msg => message2 = msg);

        const meUP = new MessageEmbed()
            .setColor('#faea70')
            .setTitle('Channel Pins Update - Message Pinned')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Channel', channelMention(channel.id))
            .addField('Message', message.content)
            .addField('Jump', `https://discordapp.com/channels/${channel.guild.id}/${channel.id}/${message.id}`)
            .setTimestamp();

        const meU = new MessageEmbed()
            .setColor('#faea70')
            .setTitle('Channel Pins Update - Message Un-Pinned')
            .setAuthor(executor2.tag, executor2.displayAvatarURL())
            .addField('Channel', channelMention(channel.id))
            .addField('Message', message2.content)
            .addField('Jump', `https://discordapp.com/channels/${channel.guild.id}/${channel.id}/${message2.id}`)
            .setTimestamp();

        if (pinMessage.id == messageID)
            c.send({ embeds: [meUP] });
        else
            c.send({ embeds: [meU] });
    },
};