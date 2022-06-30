module.exports = {
    name: 'Guild Changed',
    eventType: 'guildUpdate',
    async event(client, oldGuild) {
        const { MessageEmbed } = require('discord.js');

        const logs = await oldGuild.getModuleSetting(this.module, 'logs');
        if (!logs) return;
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        const c = oldGuild.channels.cache.get(log.id);

        const fetchedLogs = await oldGuild.fetchAuditLogs({
            limit: 1,
            type: 'GUILD_UPDATE',
        });

        const channelLog = fetchedLogs.entries.first();

        // const me = new MessageEmbed()
        //     .setColor('#faea70')
        //     .setTitle('Guild Updated')
        //     .setTimestamp();

        if (!channelLog) return;
        // c.send(me);

        const { executor, changes } = channelLog;
        changes.forEach(change => {
            if(change.key === 'name') {
                const meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Guild Name Updated')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Name', `${change.old} -> ${change.new}`)
                    .setTimestamp();
                c.send({ embeds: [meU] });
            }
        });
    },
};