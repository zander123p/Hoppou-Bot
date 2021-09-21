module.exports = {
	name: 'deploy',
	description: 'Deploy slash commands on specific guild.',
	guildOnly: true,
	options: [
		{
			name: 'single',
			type: 'SUB_COMMAND',
			description: 'Deploy a single command',
			options: [
				{
					name: 'command',
					type: 'STRING',
					description: 'The command to deploy',
					required: true,
				},
			],
		},
		{
			name: 'all',
			type: 'SUB_COMMAND',
			description: 'Deploy all commands',
			options: [
				{
					name: 'type',
					description: 'Guild or Global',
					type: 'STRING',
					required: true,
					choices: [
						{
							name: 'Guild',
							value: 'guild',
						},
						{
							name: 'Global',
							value: 'global',
						},
					],
				},
			],
		},
	],
	async execute(interaction) {
		if (interaction.user.id !== '99604105298731008') {
			return;
		}

		if (interaction.options.getSubcommand() === 'single') {
			const cmd = interaction.options.getString('command');
			const c = interaction.client.commands.find(com => com.name === cmd);
			if (c.options) {
				const command = await interaction.channel.guild.commands.create({ name: c.name, description: c.description, options: c.options });
				console.log(command);
			}
			else {
				const command = await interaction.channel.guild.commands.create({ name: c.name, description: c.description });
				console.log(command);
			}
			interaction.reply({ content: `Command Deployed: ${cmd}`, ephemeral: true });
		} else if (interaction.options.getSubcommand() === 'all') {
			const type = interaction.options.getString('type');
			if (type === 'guild') {
				for (let i = 0; i < interaction.client.commands.size; i++) {
					const cmd = Array.from(interaction.client.commands.values())[i];
					setTimeout(DeployLocal, 5000 * (i + 1), cmd, interaction);
				}
				interaction.reply({ content: 'Deploying all commands locally', ephemeral: true });
			} else if (type === 'global') {
				for (let i = 0; i < interaction.client.commands.size; i++) {
					const cmd = Array.from(interaction.client.commands.values())[i];
					setTimeout(DeployGlobal, 5000 * (i + 1), cmd, interaction);
				}
				interaction.reply({ content: 'Deploying all commands globally', ephemeral: true });
			}
		}
	},
};

async function DeployLocal(c, interaction) {
	if (c.options) {
		await interaction.channel.guild.commands.create({ name: c.name, description: c.description, options: c.options });
	}
	else {
		await interaction.channel.guild.commands.create({ name: c.name, description: c.description });
	}
	console.log(`[Deploy] Deployed command: ${c.name}`);
}

async function DeployGlobal(c, interaction) {
	if (c.options) {
		await interaction.client.application.commands.create({ name: c.name, description: c.description, options: c.options });
	}
	else {
		await interaction.client.application.commands.create({ name: c.name, description: c.description });
	}
	console.log(`[Deploy] Deployed command: ${c.name}`);
}