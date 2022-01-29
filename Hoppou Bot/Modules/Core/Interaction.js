module.exports = {
	eventType: 'interactionCreate',
	async event(client, interaction) {
		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			const member = interaction.member;

			if (command.permission)
				if (!(await member.hasGuildPermission(command.permission))) return interaction.reply({ content: 'You don\'t have permission to run that command!', ephemeral: true });

			if (interaction.client.modules.includes(command.module)) {
				if (!await member.guild.hasModule(command.module)) {
					const { MessageActionRow, MessageButton } = require('discord.js');
					const row = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setLabel('Enable Module')
								.setCustomId('enable-module')
								.setStyle('PRIMARY'),
						);
					interaction.reply({ content: `The module '${command.module}' is not active!`, components: [row] });
					interaction.fetchReply().then(async msg => {
						const filter = (i) => {
							return !i.user.bot;
						};

						const collector = msg.createMessageComponentCollector({ filter, time: 5000 });
						collector.on('collect', async i => {
							if (i.isButton()) {
								if (i.customId === 'enable-module') {
									if (!(await member.hasGuildPermission('admin.modules'))) return i.deferUpdate();

									const g = await member.guild.ensure();
									g.modules.push({ module: command.module, settings: [] });
									await g.save();
									i.deferUpdate();
									i.message.delete();
								}
							}
						});
						collector.on('end', m => {
							m.delete();
						});
					});
					return;
				}
			}

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
			const id = interaction.customId;

			if (interaction.message.interaction) {
				const command = interaction.client.commands.get(interaction.message.interaction.commandName);
				if (command.button)
					await command.menu(interaction, id);
			} else {
				const split = id.split('-');
				const mod = split[0];
				const name = split[1];
				const action = split[2];
				const menu = client.menus.find(b => b.module.toLowerCase() === mod.toLowerCase() && b.name.toLowerCase() === name.toLowerCase());
				if (menu) {
					menu.event(interaction, action);
				}
			}
		}

	},
};
