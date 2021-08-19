module.exports = async (client, oldGuild, newGuild) => {
    const { MessageEmbed } = require("discord.js");
    const guild = await oldGuild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = newGuild.channels.cache.get(channelName);

    const fetchedLogs = await oldGuild.fetchAuditLogs({
        limit: 1,
        type: 'GUILD_UPDATE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Guild Updated')
        .setTimestamp();

    if (!channelLog) return c.send(me);

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
};