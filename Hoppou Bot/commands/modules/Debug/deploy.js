module.exports = {
	name: 'deploy',
	description: 'Deploy slash commands on specific guild.',
	guildOnly: true,
	options: [
		{
			name: 'command',
			type: 'STRING',
			description: 'The command to deploy',
			required: true,
		},
	],
	async execute(message, args) {
		// if (interaction.user.id !== '99604105298731008') {
		// 	return;
		// }

		// const cmd = interaction.options.getString('command');

		// const data = [
		//     {
		//         name: 'ping',
		//         description: 'Replies with Pong!',
		//     },
		//     {
		//         name: 'echo',
		//         description: 'Replied with your input!',
		//         options: [{
		//             name: 'input',
		//             type: 'STRING',
		//             description: 'The input which should be echoed back',
		//             required: true,
		//         }],
		//     },
		//     {
		//         name: 'gif',
		//         description: 'Sends a random gif!',
		//         options: [
		//             {
		//                 name: 'category',
		//                 type: 'STRING',
		//                 description: 'The gif category',
		//                 required: true,
		//                 choices: [
		//                     {
		//                         name: 'Headpat',
		//                         value: 'gif_headpat',
		//                     },
		//                     {
		//                         name: 'Hug',
		//                         value: 'gif_hug',
		//                     },
		//                     {
		//                         name: 'Kiss',
		//                         value: 'gif_kiss'
		//                     },
		//                 ],
		//             },
		//             {
		//                 name: 'user',
		//                 type: 'USER',
		//                 description: 'The user to ping',
		//                 required: true,
		//             },
		//         ],
		//     }
		// ]

		if (args.length > 0) {
			const c = message.client.commands.find(com => com.name === args[0]);
			if (c.options) {
				const command = await message.channel.guild.commands.create({ name: c.name, description: c.description, options: c.options });
				console.log(command);
			}
			else {
				const command = await message.channel.guild.commands.create({ name: c.name, description: c.description });
				console.log(command);
			}
			return message.react('✅');
		}

		// const c = interaction.client.commands.find(com => com.name === cmd);
		// if (c.options) {
		// 	const command = await interaction.channel.guild.commands.create({ name: c.name, description: c.description, options: c.options });
		// 	console.log(command);
		// }
		// else {
		// 	const command = await interaction.channel.guild.commands.create({ name: c.name, description: c.description });
		// 	console.log(command);
		// }
		// interaction.reply({ content: `Command Deployed: ${cmd}`, ephemeral: true });

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
		// await message.channel.guild.commands?.set(data);
	},
};