module.exports = {
    name: 'onlinetracker',
    description: 'Sets the channel to update when tracked role members go online/offline.',
    options: [
        {
            name: 'channel',
            description: '',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: '',
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
    ],
    permission: 'admin.onlinetracker',
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'channel') {
            SetChannel(interaction);
        }
    },
};

async function SetChannel(interaction) {
    const channel = interaction.options.getChannel('channel');

    const g = await interaction.member.guild.ensure();

    g.settings.rejectChannel = channel.id;
    await g.save();

    interaction.reply({ content: 'Done!', ephemeral: true });
}