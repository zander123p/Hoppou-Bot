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
    ],
    execute(interaction) {
        console.log(interaction);
    },
};