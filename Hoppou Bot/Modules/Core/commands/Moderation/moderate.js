module.exports = {
    name: 'moderate',
    description: 'Used to take moderation action on a target member',
    permission: 'mod.moderate',
    options: [
        {
            name: 'ban',
            description: 'Ban the target member with a given reason',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The member to ban',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the ban',
                    type: 'STRING',
                    required: false,
                },
            ],
        },
        {
            name: 'kick',
            description: 'Kick the target member with a given reason',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The member to kick',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the kick',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'mute',
            description: 'Mute the target member with a given reason',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The member to mute',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the mute',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'time',
                    description: 'The amount of time to mute the member for e.g. 10m/10h/10d',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'unmute',
            description: 'Unmute the target member with a given reason',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The member to unmute',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the unmute',
                    type: 'STRING',
                },
            ],
        },
        {
            name: 'warn',
            description: 'Warn the target member with a given reason',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The member to warn',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for the warning',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'info',
            description: 'Get information on the target member',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The member to get information on',
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
        },
        {
            name: 'role',
            description: 'Set the roles',
            type: 'SUB_COMMAND',
            permission: 'admin.moderate',
            options: [
                {
                    name: 'role',
                    description: 'The role to set',
                    type: 'ROLE',
                    required: true,
                },
                {
                    name: 'type',
                    description: 'Which role it corresponds to',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'Mute Role',
                            value: 'mute_role',
                        },
                    ],
                },
            ],
        },
    ],
    async execute(interaction) {

        const thisCtx = this;

        if (interaction.options.getSubcommand() === 'ban') {
            BanUser(interaction);
        } else if (interaction.options.getSubcommand() === 'kick') {
            KickUser(interaction);
        } else if (interaction.options.getSubcommand() === 'warn') {
            await WarnUser(interaction);
        } else if (interaction.options.getSubcommand() === 'info') {
            UserInfo(interaction);
        } else if (interaction.options.getSubcommand() === 'mute') {
            await MuteUser(interaction, thisCtx);
        } else if (interaction.options.getSubcommand() === 'unmute') {
            await UnmuteUser(interaction, thisCtx);
        } else if (interaction.options.getSubcommand() === 'role') {
            await SetRole(interaction, thisCtx);
        }
    },
};

function KickUser(interaction) {
    const user = interaction.member.guild.members.cache.get(interaction.options.getUser('user').id);
    const reason = interaction.options.getString('reason');
    if (!user.kickable)
        return interaction.reply({ content: 'Member is not kickable!', ephemeral: true });
    user.kick(reason).then(() => {
        interaction.client.emit('guildMemberKick', user, interaction.member.user);
        return interaction.reply({ content: 'Member was kicked!', ephemeral: true });
    });
}

function BanUser(interaction) {
    const user = interaction.member.guild.members.cache.get(interaction.options.getUser('user').id);
    const reason = interaction.options.getString('reason');
    if (!user.bannable)
        return interaction.reply({ content: 'Member is not bannable!', ephemeral: true });
    user.ban({ reason }).then(() => {
        interaction.client.emit('guildBanAdd', interaction.guild, user, interaction.member.user);
        return interaction.reply({ content: 'Member was baned!', ephemeral: true });
    });
}

async function MuteUser(interaction, thisCtx) {
    const guild = interaction.member.guild;
    const muteRole = await guild.getModuleSetting(thisCtx.module, 'mute_role');
    const reason = interaction.options.getString('reason');

    if (!muteRole) {
        return interaction.reply({ content: 'A mute role needs to be assigned first!', ephemeral: true });
    }

    const user = interaction.options.getUser('user');

    const argTime = interaction.options.getString('time');
    let muteTime;

    if (['d', 'h', 'm'].includes(argTime[argTime.length - 1]) && (parseInt(argTime.replace('d', '')) || parseInt(argTime.replace('h', '') || parseInt(argTime.replace('m', ''))))) {
        switch (argTime[argTime.length - 1]) {
            case 'd':
                muteTime = 1000 * 60 * 60 * 24 * argTime.replace('d', '');
                break;
            case 'h':
                muteTime = 1000 * 60 * 60 * argTime.replace('h', '');
                break;
            case 'm':
                muteTime = 1000 * 60 * argTime.replace('m', '');
                break;
        }
    } else {
        return interaction.reply({ content: 'please enter a valid time.', ephemeral: true });
    }

    let date = Date.now();
    date += muteTime;
    date = new Date(date);

    const gUser = guild.members.cache.get(user.id);
    gUser.roles.add(guild.roles.cache.get(muteRole));

    const mongoose = require('mongoose');

    const log = new interaction.client.MuteLogs({
        _id: mongoose.Types.ObjectId(),
        userID: gUser.id,
        guildID: guild.id,
        muteTime: date.valueOf(),
    });
    await log.save();

    const profile = await user.ensure();

    profile.mutes++;
    await profile.save();

    setTimeout(async () => {
        gUser.roles.remove(guild.roles.cache.get(muteRole));
        await interaction.client.MuteLogs.findOneAndDelete({ userID: gUser.id, guildID: gUser.guild.id });
    }, muteTime);

    interaction.client.emit('guildMemberMute', gUser, interaction.member, reason);

    interaction.reply({ content: 'Member was muted', ephemeral: true });
}

async function UnmuteUser(interaction, thisCtx) {
    const guild = interaction.member.guild;
    const user = interaction.options.getUser('user');
    const member = guild.members.cache.get(user.id);
    const muteRole = await guild.getModuleSetting(thisCtx.module, 'mute_role');

    const del = await interaction.client.MuteLogs.findOne({ userID: member.id, guildID: member.guild.id });

    if (!del) {
        return interaction.reply({ content: 'specified user was not found to be muted.', ephemeral: true });
    }

    if (!muteRole) {
        return interaction.reply({ content: 'A mute role needs to be assigned first!', ephemeral: true });
    }

    await interaction.client.MuteLogs.findOneAndDelete({ userID: member.id, guildID: member.guild.id }, async () => {
        member.roles.remove(guild.roles.cache.get(muteRole));
    });

    interaction.reply({ content: 'Member was unmuted', ephemeral: true });
}

async function UserInfo(interaction) {
    const ListedEmbed = require('../../../utils/listedembed');
    const gUser = interaction.member.guild.members.cache.get(interaction.options.get('user').value);
    const user = gUser.user;
    const type = interaction.options.getString('type');

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
}

async function WarnUser(interaction) {
    const user = interaction.member.guild.members.cache.get(interaction.options.getUser('user').id);
    const reason = interaction.options.getString('reason');
    const userProfile = await user.user.ensure();
    const mg = require('mongoose');
    const newActionId = mg.Types.ObjectId();
    const log = new interaction.client.ActionLogs({
        _id: newActionId,
        userID: user.user.id,
        guildID: user.user.guild.id,
        type: 'warning',
        moderator: interaction.member.user.id,
        reason: reason,
    });
    await log.save();
    userProfile.warnings.push(newActionId);
    userProfile.totalActions += 1;
    await userProfile.save();
    if (!user.user.bot)
        user.user.send(`You have been warned by ${interaction.member.user} for ${reason}!`);

    interaction.client.emit('guildMemberWarn', user, interaction.member.user, reason);
    interaction.reply({ content: 'Member has been warned!', ephemeral: true });
}

async function SetRole(interaction, thisCtx) {
    const role = interaction.options.getRole('role');
    const type = interaction.options.getString('type');
    const guild = interaction.member.guild;

    await guild.getModuleSetting(thisCtx.module, type, role.id);

    interaction.reply({ content: 'Successfully set role', ephemeral: true });
}