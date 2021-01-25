module.exports = {
    name: 'userinfo',
    description: 'Get information on the target user',
    guildOnly: true,
    guildPermission: 'mod.userinfo',
    args: 1,
    usage: '<user> [warnings] | [kicks] | [bans]',
    aliases: ['ui'],
    async execute(message, args) {
        const ListedEmbed = require('../../../utils/listedembed');
        const user = await message.getUserFromID(args[0]);

        if (!user) {
            message.reply('please enter a valid user.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        if (user.bot) {
            message.reply('this user is a bot.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const gUser = message.guild.members.cache.get(user.id);
        const u = await gUser.ensure();

        if (args.length > 1) {
            const profile = await message.client.UserProfiles.findOne({userID: user.id});

            const moment = require('moment');

            if (args[1].toLowerCase().includes('warn')) {
                if (profile.warnings.length === 0) {
                    message.reply('no valid warns found for this user.').then(msg => msg.delete({ timeout: 5000 }));
                    return message.react('❌');
                }

                const embed = new ListedEmbed()
                    .setTitle(`Warnings for ${user.tag}`)
                    .setColor('#9a3deb')
                    .setThumbnail(user.displayAvatarURL({size: 1024}));

                let wait = 0;
                
                profile.warnings.forEach(async currentWarn => {
                    const warn = await message.client.ActionLogs.findOne({_id: currentWarn});
                    const moderator = await message.getUserFromID(warn.moderator);
    
                    embed.addField(`Moderator`, moderator.tag);
                    embed.addField(`Reason`, warn.reason);
                    embed.addField(`Time`, moment(warn.when).format('MMMM Do YYYY, h:mm:ss a'));

                    wait++;

                    if (wait === profile.warnings.length) {
                        embed.send(message.channel, 3);
                    }
                });
            } else if (args[1].toLowerCase().includes('kick')) {
                console.log(profile.kicks.length);
                if (profile.kicks.length === 0) {
                    message.reply('no valid kicks found for this user.').then(msg => msg.delete({ timeout: 5000 }));
                    return message.react('❌');
                }

                const embed = new ListedEmbed()
                    .setTitle(`Kicks for ${user.tag}`)
                    .setColor('#9a3deb')
                    .setThumbnail(user.displayAvatarURL({size: 1024}));

                let wait = 0;

                profile.kicks.forEach(async currentKick => {
                    const kick = await message.client.ActionLogs.findOne({_id: currentKick});
                    const moderator = await message.getUserFromID(kick.moderator);
    
                    embed.addField(`Moderator`, moderator.tag);
                    embed.addField(`Reason`, kick.reason);
                    embed.addField(`Time`, moment(kick.when).format('MMMM Do YYYY, h:mm:ss a'));

                    wait++;

                    if (wait === profile.kicks.length) {
                        embed.send(message.channel, 3);
                    }
            });
            } else if (args[1].toLowerCase().includes('ban')) {
                if (profile.bans.length === 0) {
                    message.reply('no valid bans found for this user.').then(msg => msg.delete({ timeout: 5000 }));
                    return message.react('❌');
                }

                const embed = new ListedEmbed()
                    .setTitle(`Bans for ${user.tag}`)
                    .setColor('#9a3deb')
                    .setThumbnail(user.displayAvatarURL({size: 1024}));

                let wait = 0;

                profile.bans.forEach(async currentBan => {
                    const ban = await message.client.ActionLogs.findOne({_id: currentBan});
                    const moderator = await message.getUserFromID(ban.moderator);
    
                    embed.addField(`Moderator`, moderator.tag);
                    embed.addField(`Reason`, ban.reason);
                    embed.addField(`Time`, moment(ban.when).format('MMMM Do YYYY, h:mm:ss a'));

                    wait++;

                    if (wait === profile.bans.length) {
                        embed.send(message.channel, 3);
                    }
                });
            }
            return;
        }

        const embed = new ListedEmbed()
            .setTitle(user.tag)
            .setColor('#9a3deb')
            .setThumbnail(user.displayAvatarURL({size: 1024}));

        embed.addField(`Account Created`, user.createdAt, true);
        embed.addField(`Joined Server`, gUser.joinedAt, true);
        if (u.permissionGroups.length > 0)
            embed.addField(`Permission Groups`, u.permissionGroups.map(group => group + '\n'), true);
        embed.addField(`Total Messages Sent`, u.messages, true);
        const profile = await message.client.UserProfiles.findOne({userID: user.id});
        if (profile) {
            embed.addField(`Mutes`, profile.mutes, true);
            embed.addField(`Warnings`, profile.warnings.length, true);
            embed.addField(`Kicks`, profile.kicks.length, true);
            embed.addField(`Bans`, profile.bans.length, true);
            embed.addField(`Total Actions`, profile.totalActions, true);
        }
        const muteLog = await message.client.MuteLogs.findOne({userID: user.id, guildID: message.guild.id});
        if (muteLog) {
            embed.addField(`Muted At`, muteLog.when);
            embed.addField(`Muted Till`, new Date(parseInt(muteLog.muteTime)));
        }

        embed.send(message.channel);
    }
}