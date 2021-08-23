module.exports = async (client, oldMember, newMember) => {
    const { MessageEmbed } = require("discord.js");
    const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');
    const g = await oldMember.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = oldMember.guild.channels.cache.get(channelName);

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

    let oldLog = g.oldLogs.find(C => { if(channelLog2.id === C.id) return C; });

    let pos = g.oldLogs.findIndex(C => { if(C.log === module.exports.id) return C; });
    if (pos < 0) {
        g.oldLogs.push({ id: channelLog2.id.toString(), log: module.exports.id });
    } else {
        g.oldLogs[pos].id = channelLog2.id.toString();
    }

    await g.save();

    if (!oldLog) return client.emit('guildMemberRoleUpdate', oldMember, newMember);

    const me = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Member Updated')
        .addField('Member', memberNicknameMention(newMember.id))
        .setTimestamp();

    if (!channelLog) return c.send({ embeds: [me] });

    const { executor, changes } = channelLog;
    if (channelLog.target.id === newMember.id)
    {
        let meU;
        if (changes[0].key === 'nick') {
            if (changes[0].old === undefined) {
                meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Member\'s Nickname Updated')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Member', memberNicknameMention(newMember.id))
                    .addField('Nickname', `${oldMember.displayName} -> ${changes[0].new}`)
                    .setTimestamp();
            } else if (changes[0].new === undefined) {
                meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Member\'s Nickname Reset')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Member', memberNicknameMention(newMember.id))
                    .setTimestamp();
            } else {
                meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Member\'s Nickname Updated')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Member', memberNicknameMention(newMember.id))
                    .addField('Nickname', `${changes[0].old} -> ${changes[0].new}`)
                    .setTimestamp();
            }
        } else if (changes[0].key === 'deaf') {
            if (changes[0].old === false) {
                meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Member Deafened')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Member', memberNicknameMention(newMember.id))
                    .setTimestamp();
            } else {
                meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Member Undeafened')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Member', memberNicknameMention(newMember.id))
                    .setTimestamp();
            }
        } else if (changes[0].key === 'mute') {
            if (changes[0].old === false) {
                meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Member Muted')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Member', memberNicknameMention(newMember.id))
                    .setTimestamp();
            } else {
                meU = new MessageEmbed()
                    .setColor('#faea70')
                    .setTitle('Member Unmuted')
                    .setAuthor(executor.tag, executor.displayAvatarURL())
                    .addField('Member', memberNicknameMention(newMember.id))
                    .setTimestamp();
            }
        }

        oldLog = g.oldLogs.find(C => { if(channelLog.id === C.id) return C; });

        pos = g.oldLogs.findIndex(C => { if(C.log === module.exports.id) return C; });
        if (pos < 0) {
            g.oldLogs.push({ id: channelLog.id.toString(), log: module.exports.id });
        } else {
            g.oldLogs[pos].id = channelLog.id.toString();
        }
        
        await g.save();

        if (!oldLog) return c.send({ embeds: [meU] });
    }
};