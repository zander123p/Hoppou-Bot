const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config(); // Needed for .env file

// Basic discord setup
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.commands.categories = [];

// Gather all commands from all modules and set the category to the module folder's name
for (const folder of getDirectories('./commands/modules')) {
    let files = fs.readdirSync(`./commands/modules/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const command = require(`./commands/modules/${folder}/${file}`);
        command.category = folder;
        client.commands.set(command.name, command);
        if (!client.commands.categories.includes(folder))
            client.commands.categories.push(folder);
    }
}

client.commands.categories = getDirectories('./commands/modules'); // I don't need to say what this does

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
        let evtName = file.split('.')[0];
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
        let evtName = file.split('.')[0];
        console.log(`Loaded Event: '${evtName}'`);
        client.on(evtName, evt.bind(null, client));
    });
});

// Load the events from the events folder
fs.readdir('./events/perms/', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/perms/${file}`);
        let evtName = file.split('.')[0];
        console.log(`Loaded Event: '${evtName}'`);
        client.on(evtName, evt.bind(null, client));
    });
});

// // Designed to fill in for the [MEMEBER UPDATE] which doesn't fire on everything that it can be got in the logs.
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

// Important shit
client.mongoose = require('./utils/mongoose');
client.Guilds = require('./models/guild');
client.UserProfiles = require('./models/user_profile');
client.GuildUsers = require('./models/guild_user');
client.ActionLogs = require('./models/action_log');
client.MuteLogs = require('./models/mute_log');

// Gets all directories in a path
function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path+'/'+file).isDirectory();
    });
}

// Gets the user from their ID
Discord.Message.prototype.getUserFromID = async function(mention) {
    const matches = await mention.match(/(\d+)/);

    if (!matches) {
        return;
    }

    const id = matches[1];

    let user = this.client.users.cache.get(id);
    if (user) {
        return user;
    }
};

// Helper function to ensure a guild is in the guils database; if a guild doesn't exist, add it
Discord.Guild.prototype.ensure = async function() {
    const mg = require('mongoose');
    const g = await this.client.Guilds.findOne({guildID: this.id});
    if (!g) {
        const guild = new this.client.Guilds({
            _id: mg.Types.ObjectId(),
            guildID: this.id,
            guildName: this.name,
            settings: {
                prefix: process.env.prefix,
                channels: [],
            },
        });
    
        guild.save().catch(err => console.error(err));
        return guild;
    } else {
        return g;
    }
};

// Helper function to ensure a user is in the user profile; if a user doesn't exist, add them
Discord.User.prototype.ensure = async function() {
    const mg = require('mongoose');
    const u = await this.client.UserProfiles.findOne({userID: this.id});
    if (!u) {
        const user = new this.client.UserProfiles({
            _id: mg.Types.ObjectId(),
            userID: this.id,
            totalActions: 0,
            mutes: 0,
            warnings: [],
            kicks: [],
        });

        user.save().catch(err => console.error(err));
        return user;
    } else {
        return u;
    }
};

Discord.GuildMember.prototype.ensure = async function() {
    const mg = require('mongoose');
    const u = await this.client.GuildUsers.findOne({userID: this.id, guildID: this.guild.id});
    if (!u) {
        const user = new this.client.GuildUsers({
            _id: mg.Types.ObjectId(),
            guildID: this.guild.id,
            userID: this.id,
            permissionGroups: [],
            messages: 0,
        });

        user.save().catch(err => console.error(err));
        return user;
    } else {
        return u;
    }
}

Discord.GuildMember.prototype.hasGuildPermission = async function(permission, role = true) {
    if (!permission || this.guild.owner === this)
        return true;

    if (role) {
        permission = permission.toLowerCase();
        const guild = await this.guild.ensure();

        let hasPerms = false;

        const roles = this.roles.cache;
        roles.forEach(r => {
            const group = guild.permissionGroups.find(g => g.role === r.id)
            if(group) {
                if (group.permissions.includes('*')) hasPerms = true;
                if (group.permissions.includes(permission) || (group.permissions.includes(permission.split('.')[0] + '.*'))) {
                    hasPerms = true;
                }
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
        }
    });

    return hasPerms;
}

client.mongoose.init(); // Init database shit
client.login(process.env.TOKEN); // Do I even need to?