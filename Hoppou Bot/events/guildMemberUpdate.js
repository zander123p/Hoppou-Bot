module.exports = async (client, oldMember, newMember) => {
    const { MessageEmbed } = require("discord.js");
    const guild = await oldMember.guild.ensure();
    const channelName = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    if (!channelName) return;
    const c = oldMember.guild.channels.cache.find(c => c.name === channelName);

    const fetchedLogs = await oldMember.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_UPDATE',
    });
    const fetchedLogs2 = await oldMember.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_ROLE_UPDATE',
    });

    const channelLog = fetchedLogs.entries.first();
    const channelLog2 = fetchedLogs2.entries.first();

    const me = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Member Updated')
        .addField('Member', newMember)
        .setTimestamp();

    console.log(channelLog);
    console.log(channelLog2.changes[0].new);

    if (!channelLog) return c.send(me);

    const { executor, changes } = channelLog;
    if (channelLog.target.id === newMember.id)
    {
        changes.forEach(change => {
            let meU = new MessageEmbed()
                .setColor('#faea70')
                .setTitle('Member Updated')
                .setAuthor(executor.tag, executor.displayAvatarURL())
                .addField('Member', newMember)
                .addField(`Change - ${correctKey(change.key)}`, `${change.old} -> ${change.new}`)
                .setTimestamp();
            c.send(meU);
        });
    }
};