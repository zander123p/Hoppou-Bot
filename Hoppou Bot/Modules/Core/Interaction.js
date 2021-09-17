module.exports = {
	eventType: 'interactionCreate',
	async event(client, interaction) {
		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			const member = interaction.member;

			if (command.permission)
				if (!(await member.hasGuildPermission(command.permission))) return interaction.reply({ content: 'You don\'t have permission to run that command!', ephemeral: true });

			// Check Module
			// if (!await member.guild.hasModule(command.module)) return interaction.reply({ content: `The module '${command.module}' is not active!`, ephemeral: true });

			await command.execute(interaction);
		}
		else if (interaction.isButton()) {
			const id = interaction.customId;

			if (interaction.message.interaction) {
				const command = interaction.client.commands.get(interaction.message.interaction.commandName);
				if (command.button)
					await command.button(interaction, id);
			} else {
				const split = id.split('-');
				const mod = split[0];
				const name = split[1];
				const action = split[2];
				const btn = client.buttons.find(b => b.module.toLowerCase() === mod.toLowerCase() && b.name.toLowerCase() === name.toLowerCase());
				if (btn) {
					btn.event(interaction, action);
				}
			}

		}
		else if (interaction.isSelectMenu()) {
			if (!interaction.message.interaction) return;
			const command = interaction.client.commands.get(interaction.message.interaction.commandName);

			if (!command.menu) return;

			await command.menu(interaction, interaction.customId);
		}

	},
};
