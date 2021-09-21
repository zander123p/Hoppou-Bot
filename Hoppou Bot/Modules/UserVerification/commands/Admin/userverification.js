module.exports = {
    name: 'userverification',
    description: 'Main user verification module command',
    options: [
        {
            name: 'channel',
            description: 'Set the channels',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'chnl',
                    description: 'The channel to set',
                    type: 'CHANNEL',
                    required: true,
                },
                {
                    name: 'type',
                    description: 'Which channel it corresponds to',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'Newcomer Channel',
                            value: 'newcomer_channel',
                        },
                        {
                            name: 'Rejection Channel',
                            value: 'reject_channel',
                        },
                    ],
                },
            ],
        },
        {
            name: 'role',
            description: 'Set the roles',
            type: 'SUB_COMMAND',
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
                            name: 'Newcomer Role',
                            value: 'newcomer_role',
                        },
                        {
                            name: 'Rejection Role',
                            value: 'reject_role',
                        },
                    ],
                },
            ],
        },
    ],
    guildOnly: true,
    permission: 'admin.userverification',
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'channel') {
            const channel = interaction.options.getChannel('chnl');
            const channelType = interaction.options.getString('type');

            if (channelType === 'newcomer_channel') {
                await interaction.member.guild.setModuleSetting(this.module, 'newcomer_channel', channel.id);
            } else if (channelType === 'reject_channel') {
                await interaction.member.guild.setModuleSetting(this.module, 'reject_channel', channel.id);
            }

            interaction.reply({ content: 'Done!', ephemeral: true });
        } else if (interaction.options.getSubcommand() === 'role') {
            const role = interaction.options.getRole('role');
            const roleType = interaction.options.getString('type');

            if (roleType === 'newcomer_role') {
                await interaction.member.guild.setModuleSetting(this.module, 'newcomer_role', role.id);
            } else if (roleType === 'reject_role') {
                await interaction.member.guild.setModuleSetting(this.module, 'reject_role', role.id);
            }

            interaction.reply({ content: 'Done!', ephemeral: true });
        }
    },
};