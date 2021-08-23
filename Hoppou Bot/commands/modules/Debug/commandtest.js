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
    execute(interaction) {
        const ListedMenu = require('../../../utils/listedmenu');

        const menu = new ListedMenu((i) => {
            console.log(i);
        }).setCustomId('a');

        for (let i = 0; i < 50; i++) {
            menu.addOption(i.toString(), 'a', 'description ' + i);
        }

        menu.send(interaction);
    },
};