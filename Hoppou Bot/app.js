const fs = require('fs');
const Discord = require('discord.js');
// Needed for .env file
require('dotenv').config();

// Basic discord setup
const client = new Discord.Client({ 'partials': ['CHANNEL', 'MESSAGE', 'REACTION'], intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'] });
client.commands = new Discord.Collection();
client.commands.categories = [];

client.cooldowns = new Discord.Collection();

client.VCTracker = new Discord.Collection();

client.modules = [];


// Gather all commands from all modules and set the category to the module folder's name
for (const folder of getDirectories('./commands/modules')) {
	const files = fs.readdirSync(`./commands/modules/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of files) {
		const command = require(`./commands/modules/${folder}/${file}`);
		command.category = folder;
		client.commands.set(command.name, command);
		if (!client.commands.categories.includes(folder)) {client.commands.categories.push(folder);}
	}
}

// I don't need to say what this does
client.commands.categories = getDirectories('./commands/modules');

client.events = new Discord.Collection();

// Load the events from the events folder
fs.readdir('./events/logs/', (err, files) => {
	if (err) return console.error;
	let index = 0;
	// files.sort((a,b) => {
	//     return fs.statSync('./events/' + a).birthtime - fs.statSync('./events/' + b).birthtime;
	// });
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const evt = require(`./events/logs/${file}`);
		const evtName = file.split('.')[0];
		console.log(`Loaded Event: '${evtName}'`);
		client.on(evtName, evt.bind(null, client));
		evt.id = evtName;
		client.events.set(index, evtName);
		index++;
	});
});

// Load the events from the events folder
fs.readdir('./events/core/', (err, files) => {
	if (err) return console.error;
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const evt = require(`./events/core/${file}`);
		const evtName = file.split('.')[0];
		console.log(`Loaded Event: '${evtName}'`);
		client.on(evt.eventType, evt.event.bind(null, client));
	});
});

// Load the events from the events folder
fs.readdir('./events/perms/', (err, files) => {
	if (err) return console.error;
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const evt = require(`./events/perms/${file}`);
		const evtName = file.split('.')[0];
		console.log(`Loaded Event: '${evt.name}'`);
		client.on(evtName, evt.event.bind(null, client));
	});
});

// Load the modules from the modules folder
const modules = getDirectories('./Modules');
modules.forEach(m => {
	fs.readdir(`./Modules/${m}`, (err, files) => {
		if (err) return console.error;
		files.forEach(file => {
			if (!file.endsWith('.js')) return;
			const evt = require(`./Modules/${m}/${file}`);
			if (!evt.eventType) return;
			const moduleName = file.split('.')[0];
			console.log(`Loaded Module: '${moduleName}'`);
			client.on(evt.eventType, evt.event.bind(null, client));
		});
	});
});

// // Load the modules from the modules folder
// let modules = getDirectories('./Modules');
// client.modules = modules;
// modules.forEach(m => {
//     fs.readdir(`./Modules/${m}`, (err, files) => {
//         if (err) return console.error;
//         files.forEach(file => {
//             if (!file.endsWith('.js')) return;
//             const evt = require(`./Modules/${m}/${file}`);
//             if (!evt.eventType) return;
//             let moduleName = file.split('.')[0];
//             console.log(`Loaded Module: '${moduleName}'`);
//             client.on(evt.eventType, evt.event.bind(null, client));
//         });
//     });    
// });

const ModuleLoader = require('./Modules/ModuleLoader');
ModuleLoader.LoadModules(client);

// // Designed to fill in for the [MEMEBER UPDATE] which doesn't fire on everything that it can be gotten in the logs.
// setInterval(async () => {
//     client.guilds.cache.forEach(async (guild) => {
//         const g = await guild.ensure();
//         const fetchedLogs = await guild.fetchAuditLogs({
//             limit: 1,
//             type: 'MEMBER_UPDATE',
//         });
//         const channelLog = fetchedLogs.entries.first();
//         if (!channelLog) return;
//         const { target } = channelLog;
//         let oldLog = g.oldLogs.find(c => { if(channelLog.id === c.id) return c; });
//         if (!oldLog && channelLog.changes[0].key != 'nick') {
//             let member = guild.members.cache.find(member => { if (member.id === target.id) return member; })
//             client.emit('guildMemberUpdate', member, member);
//         }
//     });
// }, 1000);

// ! Important shit
client.mongoose = require('./utils/mongoose');
client.Guilds = require('./models/guild');
client.UserProfiles = require('./models/user_profile');
client.UserActionProfiles = require('./models/user_action_profile');
client.GuildUsers = require('./models/guild_user');
client.ActionLogs = require('./models/action_log');
client.MuteLogs = require('./models/mute_log');
client.GuildNewJoins = require('./models/guild_new_joins');

// Gets all directories in a path
function getDirectories(path) {
	return fs.readdirSync(path).filter(function(file) {
		return fs.statSync(path + '/' + file).isDirectory();
	});
}

// Gets the user from their ID
Discord.Message.prototype.getUserFromID = async function(mention) {
	const matches = await mention.match(/(\d+)/);

	if (!matches) {
		return;
	}

	const id = matches[1];

	const user = this.client.users.cache.get(id);
	if (user) {
		return user;
	}
};

// Helper function to ensure a guild is in the guils database; if a guild doesn't exist, add it
Discord.Guild.prototype.ensure = async function() {
	const mg = require('mongoose');
	const g = await this.client.Guilds.findOne({ guildID: this.id });
	if (!g) {
		const guild = new this.client.Guilds({
			_id: mg.Types.ObjectId(),
			guildID: this.id,
			guildName: this.name,
			settings: {
				prefix: process.env.PREFIX,
				channels: [],
				VCTracker: [],
				levelMul: 0.435,
			},
		});

		await guild.save().catch(err => console.error(err));
		return guild;
	}
	else {
		return g;
	}
};

// Helper function to ensure a user is in the user profile; if a user doesn't exist, add them
Discord.User.prototype.ensure = async function() {
	const mg = require('mongoose');
	const u = await this.client.UserActionProfiles.findOne({ userID: this.id });
	if (!u) {
		const user = new this.client.UserActionProfiles({
			_id: mg.Types.ObjectId(),
			userID: this.id,
			totalActions: 0,
			mutes: 0,
			warnings: [],
			kicks: [],
		});

		await user.save().catch(err => console.error(err));
		return user;
	}
	else {
		return u;
	}
};

Discord.User.prototype.profile = async function() {
	const mg = require('mongoose');
	const u = await this.client.UserProfiles.findOne({ userID: this.id });
	if (!u) {
		const user = new this.client.UserProfiles({
			_id: mg.Types.ObjectId(),
			userID: this.id,
			title: '',
			currentBg: 0,
			currentFlare: 0,
			animated: false,
		});

		await user.save().catch(err => console.error(err));
		return user;
	}
	else {
		return u;
	}
};

Discord.GuildMember.prototype.ensure = async function() {
	const mg = require('mongoose');
	const u = await this.client.GuildUsers.findOne({ userID: this.id, guildID: this.guild.id });
	if (!u) {
		const user = new this.client.GuildUsers({
			_id: mg.Types.ObjectId(),
			guildID: this.guild.id,
			userID: this.id,
			permissionGroups: [],
			messages: 0,
			exp: 0,
		});

		await user.save().catch(err => console.error(err));
		return user;
	}
	else {
		return u;
	}
};

Discord.GuildMember.prototype.getGuildPermissionGroups = async function() {
	let groups = [];
	const guild = await this.guild.ensure();

	const roles = this.roles.cache;
	roles.forEach(r => {
		groups.push(guild.permissionGroups.filter(g => {
			if (g.role === r.id) return g;
		})[0]);
	});
	groups = groups.filter(element => element !== undefined);
	return groups;
};

Discord.GuildMember.prototype.getGuildPermissionGroups = async function() {
    let groups = [];
    const guild = await this.guild.ensure();

    const roles = this.roles.cache;
    roles.forEach(r => {
        groups.push(guild.permissionGroups.filter(g => {
            if (g.role === r.id) return g;
        })[0]);
    });
    groups = groups.filter(element => element !== undefined);
    return groups;
}

Discord.GuildMember.prototype.hasGuildPermission = async function(permission, role = true) {
	if (!permission || await this.guild.fetchOwner() === this) {return true;}

	if (role) {
		permission = permission.toLowerCase();
		const guild = await this.guild.ensure();

		let hasPerms = false;

		const roles = this.roles.cache;
		roles.forEach(r => {
			const group = guild.permissionGroups.find(g => g.role === r.id);
			if(group) {
				if (group.permissions.includes('*')) hasPerms = true;
				if (group.blacklist.includes(permission)) return;
				if (group.permissions.includes(permission.split('.')[0] + '.*')) hasPerms = true;
				if (group.permissions.includes(permission)) hasPerms = true;
			}
		});

		return hasPerms;
	}

	const user = await this.ensure();
	const guild = await this.guild.ensure();
	permission = permission.toLowerCase();

	let hasPerms = false;
	guild.permissionGroups.forEach(group => {
		if (user.permissionGroups.includes(group.name)) {
			if (group.permissions.includes('*')) hasPerms = true;
			if (group.permissions.includes(permission) || (group.permissions.includes(permission.split('.')[0] + '.*'))) {
				hasPerms = true;
			}
			if (group.blacklist.includes(permission)) hasPerms = false;
		}
	});

	return hasPerms;
};

Discord.GuildMember.prototype.getLevel = async function() {
	const gUser = await this.ensure();
	const g = await this.guild.ensure();
	const c = (g.settings.levelMul) ? g.settings.levelMul : 0.435;
	const level = Math.floor(c * Math.sqrt((gUser.exp) ? gUser.exp : 0));
	return level;
};

// Init database shit and login
client.mongoose.init();
client.login(process.env.TOKEN);