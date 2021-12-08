module.exports = {
    name: 'Message Deleted',
    eventType: 'messageDelete',
    async event(client, message) {
        const { MessageEmbed } = require('discord.js');
        const { userMention, channelMention } = require('@discordjs/builders');

        const guild = await message.guild.ensure();
        const logs = await message.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = message.guild.channels.cache.get(log.id);

        if (message.partial) {
            const fetchedLogs = await message.guild.fetchAuditLogs({
                limit: 1,
                type: 'MESSAGE_DELETE',
            });

            const deletionLog = fetchedLogs.entries.first();

            const me = new MessageEmbed()
                .setColor('#db4444')
                .setTitle('Unknown Message Deleted')
                .addField('Message Author', 'Unknown')
                .addField('Channel', channelMention(deletionLog.extra.channel.id))
                .setTimestamp();

            const oldLog = guild.oldLogs.find(C => { if(deletionLog.id === C.id) return C; });
            if (oldLog) return c.send({ embeds: [me] });

            const pos = guild.oldLogs.findIndex(C => { if(C.log === this.name.toLowerCase()) return C; });
            if (pos < 0) {
                guild.oldLogs.push({ id: deletionLog.id.toString(), log: this.name.toLowerCase() });
            } else {
                guild.oldLogs[pos].id = deletionLog.id.toString();
            }

            const { executor } = deletionLog;
            if (!deletionLog.extra.channel.guild) return;

            const meU = new MessageEmbed()
                .setColor('#db4444')
                .setTitle('Unknown Message Deleted')
                .setAuthor(executor.tag, executor.displayAvatarURL())
                .addField('Message Author', 'Unknown')
                .addField('Channel', channelMention(deletionLog.extra.channel.id))
                .setTimestamp();

            return c.send({ embeds: [meU] });
        }

        if (message.author.bot || !message.guild) return;


        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });

        const deletionLog = fetchedLogs.entries.first();

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Message Deleted')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .addField('Message Author', userMention(message.author.id))
            .addField('Channel', channelMention(message.channel.id))
            .addField('Message', message.content)
            .addField('Jump to message', `[Jump](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
            .setTimestamp();

        if (!deletionLog) return c.send({ embeds: [me] });

        const oldLog = guild.oldLogs.find(C => { if(deletionLog.id === C.id) return C; });
        if (oldLog) return c.send({ embeds: [me] });

        const pos = guild.oldLogs.findIndex(C => { if(C.log === this.name.toLowerCase()) return C; });
        if (pos < 0) {
            guild.oldLogs.push({ id: deletionLog.id.toString(), log: this.name.toLowerCase() });
        } else {
            guild.oldLogs[pos].id = deletionLog.id.toString();
        }

        await guild.save();

        const { executor } = deletionLog;

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Message Deleted')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Message Author', message.author)
            .addField('Channel', message.channel)
            .addField('Message', message.content)
            .addField('Jump to message', `[Jump](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};