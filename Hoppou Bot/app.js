const Discord = require('discord.js');
// Needed for .env file
require('dotenv').config();

// Basic discord setup
const client = new Discord.Client({ 'partials': ['CHANNEL', 'MESSAGE', 'REACTION'], intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MEMBERS'] });

client.commands = new Discord.Collection();
client.commands.categories = [];
client.cooldowns = new Discord.Collection();
client.VCTracker = new Discord.Collection();
client.modules = [];
client.buttons = [];
client.permissions = [];
client.logs = [];

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
client.Info = require('./models/info');

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

client.getVersion = async function(global) {
	if (global) {
		const gV = await client.API.PostEndpoint('version');
		return gV.version;
	} else {
		const info = await client.getInfo();
		if (!info.version) {
			const version = await client.API.PostEndpoint('version');

			info.version = version.version;
			await info.save();
			return version.version;
		} else {
			return info.version;
		}
	}
};

client.getInfo = async function() {
	const mg = require('mongoose');
	const info = await client.Info.findOne({ botID: client.user.id });
	if (!info) {
		const Info = new client.Info({
			_id: mg.Types.ObjectId(),
			botID: client.user.id,
			verison: '0.0.0',
		});

		await Info.save().catch(err => console.error(err));
		return Info;
	}
	else {
		return info;
	}
};

Discord.Guild.prototype.hasModule = async function(mod) {
	const g = await this.ensure();
	return g.modules.find(m => m.module.toLowerCase() === mod.toLowerCase());
};

Discord.Guild.prototype.getModuleSetting = async function(mod, setting) {
	const g = await this.ensure();
	const S = g.modules.find(m => m.module.toLowerCase() === mod.toLowerCase());
	if (!S) return;
	const s = S.settings.find(se => se.name === setting);
	if (s) return s.value;
};

Discord.Guild.prototype.setModuleSetting = async function(mod, setting, value) {
	const g = await this.ensure();
	const S = g.modules.find(m => m.module.toLowerCase() === mod.toLowerCase());

	let s;
	if (S) {
		s = S.settings.find(se => se.name === setting);
	} else {
		g.modules.push({ module: mod, settings: { name: setting, value } });
		return await g.save();
	}

	if (s) {
		g.modules.find(m => m.module.toLowerCase() === mod.toLowerCase()).settings.find(se => se.name === setting).value = value;
		await g.save();
	} else {
		g.modules.find(m => m.module.toLowerCase() === mod.toLowerCase()).settings.push({ name: setting, value });
		await g.save();
	}
};

Discord.Guild.prototype.clearModuleSetting = async function(mod, setting) {
	const g = await this.ensure();
	const S = g.modules.find(m => m.module.toLowerCase() === mod.toLowerCase());
	if (!S) return;
	const s = S.settings.find(se => se.name === setting);
	if (s) {
		g.modules.find(m => m.module.toLowerCase() === mod.toLowerCase()).settings.splice(S.settings.indexOf(s), 1);
		await g.save();
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
};

Discord.GuildMember.prototype.hasGuildPermission = async function(permission) {
	permission = permission.toLowerCase();

	if (!permission || await this.guild.fetchOwner() === this) {return true;}

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
};

Discord.GuildMember.prototype.getLevel = async function() {
	const gUser = await this.ensure();
	const c = 0.435;
	const level = Math.floor(c * Math.sqrt((gUser.exp) ? gUser.exp : 0));
	return level;
};

// Init database shit and login
client.mongoose.init();
client.API = require('./utils/api');
client.login(process.env.TOKEN);