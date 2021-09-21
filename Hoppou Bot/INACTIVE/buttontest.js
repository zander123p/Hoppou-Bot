module.exports = {
	name: 'buttontest',
	description: 'Testing buttons.',
	async execute(interaction) {
		// const { MessageActionRow, MessageButton } = require('discord.js');
        const ListedEmbed = require('../utils/listedembed');

		// const row = new MessageActionRow()
		// 	.addComponents(
		// 		new MessageButton()
		// 			.setCustomID('b1')
		// 			.setLabel('Test Button')
		// 			.setStyle('PRIMARY'),
		// 	);

		// await interaction.reply({ content: 'Button Test', components: [row] });

		const emb = new ListedEmbed()
			.setColor('#9a3deb')
			.setTitle('Test');

		emb.addField('Field 1', 'Testing...');
		emb.addField('Field 2', 'Testing...');
		emb.addField('Field 3', 'Testing...');
		emb.addField('Field 4', 'Testing...');
		emb.addField('Field 5', 'Testing...');
		emb.addField('Field 6', 'Testing...');
		emb.addField('Field 7', 'Testing...');
		emb.addField('Field 8', 'Testing...');

		emb.send(interaction, 4);
	},
	// async button(interaction, id) {
	// 	interaction.reply(`[Buttton ID: ${id}] Clicked by ${interaction.member.user.username}`);
	// },
};