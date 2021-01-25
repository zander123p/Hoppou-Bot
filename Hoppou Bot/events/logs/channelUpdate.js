module.exports = async (client, oldChannel, newChannel) => {
    const { MessageEmbed } = require("discord.js");
    if (oldChannel.type === 'dm') return;
    const guild = await oldChannel.guild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = oldChannel.guild.channels.cache.get(channelName);

    const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_UPDATE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Channel Updated')
        .addField('Channel', newChannel)
        .setTimestamp();

    if (!channelLog) return c.send(me);

    const { executor, changes } = channelLog;
    if (channelLog.target.id === newChannel.id)
    {
        changes.forEach(change => {
            let meU = new MessageEmbed()
                .setColor('#faea70')
                .setTitle('Channel Updated')
                .setAuthor(executor.tag, executor.displayAvatarURL())
                .addField('Channel', newChannel)
                .addField(`Change - ${correctKey(change.key)}`, `${change.old} -> ${change.new}`)
                .setTimestamp();
            c.send(meU);
        });
    } else if (oldChannel.rawPosition != newChannel.rawPosition) {
        let meU = new MessageEmbed()
            .setColor('#faea70')
            .setTitle('Channel Updated')
            .setAuthor(executor.tag, executor.displayAvatarURL())
            .addField('Channel', newChannel)
            .addField(`Change - Position`, `${oldChannel.rawPosition} -> ${newChannel.rawPosition}`)
            .setTimestamp();
        //c.send(meU);
    }
    //TODO: Add permission override
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