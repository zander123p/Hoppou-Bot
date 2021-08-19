module.exports = async (client, oldMember, newMember) => {
    const { MessageEmbed } = require("discord.js");
    const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');
    const guild = await oldMember.guild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = oldMember.guild.channels.cache.get(channelName);

    const fetchedLogs = await oldMember.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_ROLE_UPDATE',
    });

    const channelLog = fetchedLogs.entries.first();

    const me = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Member Roles Changed')
        .addField('Member', memberNicknameMention(newMember.id))
        .setTimestamp();

    if (!channelLog) return c.send({ embeds: [me] });

    const { executor, changes } = channelLog;
    if (channelLog.target.id === newMember.id)
    {
        let meU;
        if (changes[0].key === '$remove') {
            meU = new MessageEmbed()
                .setColor('#db4444')
                .setTitle('Member Roles Removed')
                .setAuthor(executor.tag, executor.displayAvatarURL())
                .addField('Member', memberNicknameMention(newMember.id))
                .addField('Role', changes[0].new[0].name)
                .setTimestamp();
        } else if (changes[0].key === '$add') {
            meU = new MessageEmbed()
                .setColor('#70f567')
                .setTitle('Member Roles Added')
                .setAuthor(executor.tag, executor.displayAvatarURL())
                .addField('Member', memberNicknameMention(newMember.id))
                .addField('Role', changes[0].new[0].name)
                .setTimestamp();
        }
        c.send({ embeds: [meU] });
    }
};