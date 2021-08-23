module.exports = {
    name: 'moderate',
    description: 'Used to take moderation action on a provided user',
    guildPermission: 'mod.moderate',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to take action against',
            required: true,
        },
        {
            name: 'action',
            type: 'STRING',
            description: 'What action to take',
            required: true,
            choices: [
                {
                    name: 'Ban',
                    value: 'mod_ban',
                },
                {
                    name: 'Kick',
                    value: 'mod_kick',
                },
                {
                    name: 'Mute',
                    value: 'mod_mute',
                },
                {
                    name: 'Warn',
                    value: 'mod_warn',
                },
            ],
        },
        {
            name: 'reason',
            description: 'Reason for the action',
            type: 'STRING',
            required: true,
        },
    ],
    async execute(interaction) {
        const user = interaction.guild.members.cache.get(interaction.options.get('user').value);
        const reason = interaction.options.get('reason').value;
        const action = interaction.options.get('action').value;

        switch (action) {
            case 'mod_kick':
                KickUser(interaction, user, reason);
                break;
            case 'mod_ban':
                BanUser(interaction, user, reason);
                break;
            case 'mod_mute':
                interaction.reply({ content: 'NYI', ephemeral: true });
                break;
            case 'mod_warn':
                await WarnUser(interaction, user, reason);
                break;
        }
    },
};

function KickUser(interaction, user, reason) {
    if (!user.kickable)
        return interaction.reply({ content: 'User is not kickable!', ephemeral: true });
    user.kick(reason).then(() => {
        interaction.client.emit('guildMemberKick', user, interaction.member.user);
        return interaction.reply({ content: 'User was kicked!', ephemeral: true });
    });
}

function BanUser(interaction, user, reason) {
    if (!user.bannable)
        return interaction.reply({ content: 'User is not bannable!', ephemeral: true });
    user.ban({ reason }).then(() => {
        interaction.client.emit('guildBanAdd', interaction.guild, user, interaction.member.user);
        return interaction.reply({ content: 'User was baned!', ephemeral: true });
    });
}

// function MuteUser(interaction, user, reason) {

// }

async function WarnUser(interaction, user, reason) {
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
    interaction.reply({ content: 'User has been warned!', ephemeral: true });
}