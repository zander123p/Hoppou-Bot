module.exports = {
    name: 'modules',
    description: 'Toggle a module of the bot.',
    guildOnly: true,
    permission: 'admin.modules',
    // args: 1,
    // usage: '<module>',
    async execute(interaction) {
        // const name = args[0];


		const ListedMenu = require('../../../../utils/listedmenu');

        const menu = new ListedMenu(async (i) => await MenuCallback(i))
            .setPlaceholder('Select Modules to toggle...')
            .setMaxValues(interaction.client.modules.length)
            .setCustomId('a');

        for (const m of interaction.client.modules) {
            if (await interaction.member.guild.hasModule(m)) {
                menu.addOption(m, m, '', { name: '🟢' });
            } else {
                menu.addOption(m, m, '', { name: '🔴' });
            }
        }
        menu.send(interaction);

        // if (guild.settings.modules.length === 0 && isValidModule(name)) {
        //     guild.settings.modules = [name];
        //     await guild.save();
        //     return message.react('✅');
        // }
    },
};

// function isValidModule(m) {
//     const modules = getDirectories('./Modules');
//     return modules.find(d => d.toLowerCase() === m.toLowerCase());
// }

// // Gets all directories in a path
// function getDirectories(path) {
//     const fs = require('fs');
//     return fs.readdirSync(path).filter(function(file) {
//       return fs.statSync(path + '/' + file).isDirectory();
//     });
// }

async function MenuCallback(i) {
    const g = await i.member.guild.ensure();

    for (const v of i.values) {
        const guild = i.member.guild;
        if (await guild.hasModule(v)) {
            g.modules.splice(g.modules.indexOf(v), 1);
        } else {
            g.modules.push({ module: v, settings: [] });
        }
    }
    await g.save();

    const ListedMenu = require('../../../../utils/listedmenu');

    const menu = new ListedMenu(async (inte) => MenuCallback(inte))
        .setPlaceholder('Select Modules to toggle...')
        .setMaxValues(i.client.modules.length)
        .setCustomId('a');

    for (const m of i.client.modules) {
        if (await i.member.guild.hasModule(m)) {
            menu.addOption(m, m, '', { name: '🟢' });
        } else {
            menu.addOption(m, m, '', { name: '🔴' });
        }
    }
    menu.ApplyChanges(i);
}