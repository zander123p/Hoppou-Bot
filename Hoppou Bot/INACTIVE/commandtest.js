module.exports = {
    name: 'commandtest',
    description: 'testing how slash sub-commands work',
    options: [
        {
            name: 'add',
            description: 'command description',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'permission',
                    description: 'Permission to edit',
                    type: 'STRING',
                },
            ],
        },
        {
            name: 'remove',
            description: 'command desc',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'permission',
                    description: 'Permission to remove',
                    type: 'STRING',
                },
            ],
        },
    ],
    async execute(interaction) {
        const data = await interaction.client.API.PostEndpoint('version');
        interaction.reply(data.version + '\n' + data.changelog);
    },
};