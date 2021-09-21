module.exports = {
	name: 'give',
	description: 'Give someone either a hug, kiss, snuggle, bite, slap or pat.',
	guildOnly: true,
	options: [
		{
			name: 'category',
			type: 'STRING',
			description: 'What to give',
			required: true,
			choices: [
				{
					name: 'Hug',
					value: 'gif_hug',
				},
				{
					name: 'Kiss',
					value: 'gif_kiss',
				},
				{
					name: 'Snuggle',
					value: 'gif_snuggle',
				},
				{
					name: 'Bite',
					value: 'gif_bite',
				},
				{
					name: 'Slap',
					value: 'gif_slap',
				},
				{
					name: 'Pat',
					value: 'gif_pat',
				},
			],
		},
		{
			name: 'user',
			type: 'USER',
			description: 'The user to give to',
			required: true,
		},
	],
	async execute(interaction) {
		const cat = interaction.options.get('category').value;

		switch (cat) {
		case 'gif_hug':
			Hug(interaction, await GetGif('hug'));
			break;
		case 'gif_kiss':
			Kiss(interaction, await GetGif('kiss'));
			break;
		case 'gif_snuggle':
			Snuggle(interaction, await GetGif('snuggle'));
			break;
		case 'gif_bite':
			Bite(interaction, await GetGif('bite'));
			break;
		case 'gif_slap':
			Slap(interaction, await GetGif('slap'));
			break;
		case 'gif_pat':
			Pat(interaction, await GetGif('pat'));
			break;
		}
	},
};

function Hug(interaction, data) {
	const Discord = require('discord.js');

	const author = interaction.member.user;
	const user = interaction.options.get('user').user;

	if (user.id === author.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username}, you have hugged yourself!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}
	else if (user.id === interaction.client.user.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username} hugged me!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}

	const msg = new Discord.MessageEmbed()
		.setColor('#9a3deb')
		.setTitle(`${user.username}, you have been hugged by ${author.username}!`)
		.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
	interaction.reply({ embeds: [msg] });
}

function Kiss(interaction, data) {
	const Discord = require('discord.js');

	const author = interaction.member.user;
	const user = interaction.options.get('user').user;

	if (user.id === author.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username}, you have kissed yourself!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}
	else if (user.id === interaction.client.user.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username} kissed me!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}

	const msg = new Discord.MessageEmbed()
		.setColor('#9a3deb')
		.setTitle(`${user.username}, you have been kissed by ${author.username}!`)
		.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
	interaction.reply({ embeds: [msg] });
}

function Snuggle(interaction, data) {
	const Discord = require('discord.js');

	const author = interaction.member.user;
	const user = interaction.options.get('user').user;

	if (user.id === author.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username}, you have snuggled yourself!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}
	else if (user.id === interaction.client.user.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username} snuggled me!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}

	const msg = new Discord.MessageEmbed()
		.setColor('#9a3deb')
		.setTitle(`${user.username}, you have been snuggled by ${author.username}!`)
		.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
	interaction.reply({ embeds: [msg] });
}

function Bite(interaction, data) {
	const Discord = require('discord.js');

	const author = interaction.member.user;
	const user = interaction.options.get('user').user;

	if (user.id === author.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username}, you have bitten yourself!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}
	else if (user.id === interaction.client.user.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username} bit me!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}

	const msg = new Discord.MessageEmbed()
		.setColor('#9a3deb')
		.setTitle(`${user.username}, you have been bitten by ${author.username}!`)
		.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
	interaction.reply({ embeds: [msg] });
}

function Slap(interaction, data) {
	const Discord = require('discord.js');

	const author = interaction.member.user;
	const user = interaction.options.get('user').user;

	if (user.id === author.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username}, you have slapped yourself!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}
	else if (user.id === interaction.client.user.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username} slapped me!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}

	const msg = new Discord.MessageEmbed()
		.setColor('#9a3deb')
		.setTitle(`${user.username}, you have been slapped by ${author.username}!`)
		.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
	interaction.reply({ embeds: [msg] });
}

function Pat(interaction, data) {
	const Discord = require('discord.js');

	const author = interaction.member.user;
	const user = interaction.options.get('user').user;

	if (user.id === author.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username}, you have pat yourself!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}
	else if (user.id === interaction.client.user.id) {
		const msg = new Discord.MessageEmbed()
			.setColor('#9a3deb')
			.setTitle(`${author.username} pat me!`)
			.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
		return interaction.reply({ embeds: [msg] });
	}

	const msg = new Discord.MessageEmbed()
		.setColor('#9a3deb')
		.setTitle(`${user.username}, you have been pat by ${author.username}!`)
		.setImage(data.results[Math.floor(Math.random() * Object.keys(data.results).length)].media[0].gif.url);
	interaction.reply({ embeds: [msg] });
}

async function GetGif(type) {
	const got = require('got');
	const response = await got(`https://api.tenor.com/v1/search?q=anime+${type}&key=${process.env.APIKEY}&limit=25`, { json: true });
	return response.body;
}
