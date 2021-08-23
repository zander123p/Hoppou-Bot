module.exports = {
    name: 'userinfo',
    description: 'Get information on the target user',
    guildPermission: 'mod.userinfo',
    options: [
        {
            name: 'user',
            description: 'Target user',
            type: 'USER',
            required: true,
        },
        {
            name: 'type',
            description: 'What type of info',
            type: 'STRING',
            required: false,
            choices: [
                {
                    name: 'Warnings',
                    value: 'ui_warns',
                },
                {
                    name: 'Kicks',
                    value: 'ui_kicks',
                },
                {
                    name: 'Bans',
                    value: 'ui_bans',
                },
                {
                    name: 'VC',
                    value: 'ui_vc',
                },
            ],
        },
    ],
    // usage: '<user> [warnings] | [kicks] | [bans] | [VC]',
    async execute(interaction) {
        const ListedEmbed = require('../../../utils/listedembed');
        const gUser = interaction.member.guild.members.cache.get(interaction.options.get('user').value);
        const user = gUser.user;
        let type;
        if (interaction.options.get('type'))
            type = interaction.options.get('type').value;

        if (gUser.user.bot) {
            interaction.reply({ content: 'This user is a bot.', ephemeral: true });
        }

        const u = await gUser.ensure();

        if (type) {
            const profile = await interaction.client.UserActionProfiles.findOne({ userID: user.id });

            const moment = require('moment');

            if (type === 'ui_warns') {
                if (profile.warnings.length === 0) {
                    return interaction.reply({ content: 'no valid warns found for this user.', ephemeral: true });
                }

                const embed = new ListedEmbed()
                    .setTitle(`Warnings for ${user.tag}`)
                    .setColor('#9a3deb')
                    .setThumbnail(user.displayAvatarURL({ format: 'jpg', size: 1024 }));

                let wait = 0;

                profile.warnings.forEach(async currentWarn => {
                    const warn = await interaction.client.ActionLogs.findOne({ _id: currentWarn });
                    const moderator = await gUser.guild.members.cache.get(warn.moderator);

                    embed.addField('Moderator', moderator.tag);
                    embed.addField('Reason', warn.reason);
                    embed.addField('Time', moment(warn.when).format('MMMM Do YYYY, h:mm:ss a'));

                    wait++;

                    if (wait === profile.warnings.length) {
                        embed.send(interaction, 3);
                    }
                });
            } else if (type === 'ui_kick') {
                if (profile.kicks.length === 0) {
                    return interaction.reply({ content: 'no valid kicks found for this user.', ephemeral: true });
                }

                const embed = new ListedEmbed()
                    .setTitle(`Kicks for ${user.tag}`)
                    .setColor('#9a3deb')
                    .setThumbnail(user.displayAvatarURL({ size: 1024 }));

                let wait = 0;

                profile.kicks.forEach(async currentKick => {
                    const kick = await interaction.client.ActionLogs.findOne({ _id: currentKick });
                    const moderator = await gUser.guild.members.cache.get(kick.moderator);

                    embed.addField('Moderator', moderator.tag);
                    embed.addField('Reason', kick.reason);
                    embed.addField('Time', moment(kick.when).format('MMMM Do YYYY, h:mm:ss a'));

                    wait++;

                    if (wait === profile.kicks.length) {
                        embed.send(interaction, 3);
                    }
            });
            } else if (type === 'ui_ban') {
                if (profile.bans.length === 0) {
                    return interaction.reply({ content: 'no valid bans found for this user.', ephemeral: true });
                }

                const embed = new ListedEmbed()
                    .setTitle(`Bans for ${user.tag}`)
                    .setColor('#9a3deb')
                    .setThumbnail(user.displayAvatarURL({ size: 1024 }));

                let wait = 0;

                profile.bans.forEach(async currentBan => {
                    const ban = await interaction.client.ActionLogs.findOne({ _id: currentBan });
                    const moderator = await gUser.guild.members.cache.get(ban.moderator);

                    embed.addField('Moderator', moderator.tag);
                    embed.addField('Reason', ban.reason);
                    embed.addField('Time', moment(ban.when).format('MMMM Do YYYY, h:mm:ss a'));

                    wait++;

                    if (wait === profile.bans.length) {
                        embed.send(interaction, 3);
                    }
                });
            } else if (type === 'ui_vc') {
                if (!u.VCTracker || u.VCTracker.length === 0) {
                    return interaction.reply({ content: 'no VCs found tracked on this user.', ephemeral: true });
                }

                const embed = new ListedEmbed()
                    .setTitle(`VCs tracked on ${user.tag}`)
                    .setColor('#9a3deb')
                    .setThumbnail(user.displayAvatarURL({ size: 1024 }));

                u.VCTracker.forEach(VC => {
                    const chanl = interaction.guild.channels.cache.get(VC.id);
                    embed.addField(`${chanl.name}`, `${VC.mins}m`);
                });

                embed.send(interaction, 3);
            }
            return;
        }

        const embed = new ListedEmbed()
            .setTitle(user.tag)
            .setColor('#9a3deb')
            .setThumbnail(user.displayAvatarURL({ size: 1024 }));

        embed.addField('Account Created', user.createdAt, true);
        embed.addField('Joined Server', gUser.joinedAt, true);
        if (u.permissionGroups.length > 0)
            embed.addField('Permission Groups', u.permissionGroups.map(group => group + '\n'), true);
        embed.addField('Total Messages Sent', u.messages, true);
        const profile = await interaction.client.UserActionProfiles.findOne({ userID: user.id });
        if (profile) {
            embed.addField('Mutes', profile.mutes, true);
            embed.addField('Warnings', profile.warnings.length, true);
            embed.addField('Kicks', profile.kicks.length, true);
            embed.addField('Bans', profile.bans.length, true);
            embed.addField('Total Actions', profile.totalActions, true);
        }
        const muteLog = await interaction.client.MuteLogs.findOne({ userID: user.id, guildID: gUser.guild.id });
        if (muteLog) {
            embed.addField('Muted At', muteLog.when);
            embed.addField('Muted Till', new Date(parseInt(muteLog.muteTime)));
        }

        embed.send(interaction);
    },
};