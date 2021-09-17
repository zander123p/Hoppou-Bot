module.exports = {
	name: 'undeploy',
	description: 'Undeploy slash commands on specific guild.',
	guildOnly: true,
	async execute(message, args) {
		if (message.author.id !== '99604105298731008') {
			return message.react('❌');
		}

		if (args.length > 0) {
			const commands = await message.channel.guild.commands.fetch();
			const c = args[0];
			const command = commands.find(cmd => cmd.name === c);
			await message.channel.guild.commands.delete(command);
			return message.react('✅');
		} else {
			const commands = await message.channel.guild.commands.fetch();
			let wait;
			commands.forEach(async c => {
				await message.channel.guild.commands.delete(c);
				if (wait === commands.length)
					return message.react('✅');
				wait++;
			});
		}

		// if (process.env.DEV === 'true') {
		// 	await message.client.commands.forEach(async c => {
		// 		if (c.options) {
		// 			const command = await message.channel.guild.commands.create({ name: c.name, description: c.description, options: c.options });
		// 			console.log(command);
		// 		}
		// 		else {
		// 			const command = await message.channel.guild.commands.create({ name: c.name, description: c.description });
		// 			console.log(command);
		// 		}

		// 		if (message.client.commands.length === message.client.commands.indexOf(c) + 1) {
		// 			await message.react('✅');
		// 		}
		// 	});
		// }
		// else {
		// 	// const command = await message.client.application?.set(data);
		// }
		// // await message.channel.guild.commands?.set(data);
	},
};