module.exports = {
	eventType: 'interactionCreate',
	async event(client, interaction) {
		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			const member = interaction.member;

			if (!(await member.hasGuildPermission(command.guildPermission))) return interaction.reply({ content: 'You don\'t have permission to run that command!', ephemeral: true });

			await command.execute(interaction);
		}
		else if (interaction.isButton()) {
			const command = interaction.client.commands.get(interaction.message.interaction.commandName);

			if (!command.button) return;

			await command.button(interaction, interaction.customID);
		}
		else if (interaction.isSelectMenu()) {
			const command = interaction.client.commands.get(interaction.message.interaction.commandName);

			if (!command.menu) return;

			await command.menu(interaction, interaction.customId);
		}

	},
};
