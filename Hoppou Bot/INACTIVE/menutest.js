module.exports = {
	name: 'menutest',
	description: 'Testing menus.',
	async execute(interaction) {
		// const { MessageActionRow, MessageSelectMenu } = require('discord.js');

		// const mods = ['Base', 'Verification', 'Ranks', 'VCTracker', 'Online Dectector', 'Reaction Roles', 'Gallery'];
		// // const mods = ['Ranks', 'VCTracker', 'Online Dectector', 'Gallery'];
		// const options = [];
		// mods.forEach(m => {
		// 	const a = (Math.floor(Math.random() * 2) + 1 === 2) ? '🟢' : '🔴';
		// 	options.push({ label: m, description: m + ' description', value: 'module_' + m, emoji: { name: a } });
		// });

		// const row = new MessageActionRow()
		// 	.addComponents(
		// 		new MessageSelectMenu()
		// 			.setCustomId('select')
		// 			.setPlaceholder('Nothing selected')
		// 			.addOptions(options),
		// 	);

		// await interaction.reply({ content: 'Menu Test', components: [row] });

		const ListedMenu = require('../../../utils/listedmenu');

        const menu = new ListedMenu((i) => {
            console.log(i);
			i.deferUpdate();
        }).setCustomId('a').setTitle('Test');

        for (let i = 1; i < 51; i++) {
            menu.addOption(i.toString(), 'a ' + i, 'description ' + i);
        }

        menu.send(interaction);
	},
};