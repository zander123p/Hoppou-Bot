module.exports = {
    name: 'welcome',
    description: 'Main welcome module command',
    options: [
        {
            name: 'channel',
            description: 'Set the welcome channel',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to set',
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
        {
            name: 'role',
            description: 'Set the welcome role',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'role',
                    description: 'The role to set',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
        {
            name: 'message',
            description: 'Set welcome message',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'message',
                    description: 'The welcome message',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'welcome_on_join',
            description: 'Should the user be welcomed on join?',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'flag',
                    description: 'Sets the join flag',
                    type: 'BOOLEAN',
                    required: true,
                },
            ],
        },
    ],
    guildOnly: true,
    permission: 'admin.welcome',
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'channel') {
            const channel = interaction.options.getChannel('channel');

            await interaction.member.guild.setModuleSetting(this.module, 'welcome_channel', channel.id);
            interaction.reply({ content: 'Done!', ephemeral: true });
        } else if (interaction.options.getSubcommand() === 'role') {
            const role = interaction.options.getRole('role');

            await interaction.member.guild.setModuleSetting(this.module, 'welcome_role', role.id);
            interaction.reply({ content: 'Done!', ephemeral: true });
        } else if (interaction.options.getSubcommand() === 'message') {
            const msg = interaction.options.getString('message');

            await interaction.member.guild.setModuleSetting(this.module, 'welcome_message', msg);
            interaction.reply({ content: 'Done!', ephemeral: true });
        } else if (interaction.options.getSubcommand() === 'welcome_on_join') {
            const flag = interaction.options.getBoolean('flag');

            await interaction.member.guild.setModuleSetting(this.module, 'join_flag', flag);
            interaction.reply({ content: 'Done!', ephemeral: true });
        }
    },
};