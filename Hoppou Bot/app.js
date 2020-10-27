const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config(); // Needed for .env file

// Basic discord setup
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Gather all commands from all modules and set the category to the module folder's name
for (const folder of getDirectories('./commands/modules')) {
    let files = fs.readdirSync(`./commands/modules/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const command = require(`./commands/modules/${folder}/${file}`);
        command.category = folder;
        client.commands.set(command.name, command);
    }
}

client.commands.categories = getDirectories('./commands/modules'); // I don't need to say what this does

client.events = new Discord.Collection();

// Load the events from the events folder
fs.readdir('./events/', (err, files) => {
    if (err) return console.error;
    let index = 0;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
        console.log(`Loaded Event: '${evtName}'`);
        client.on(evtName, evt.bind(null, client));
        evt.id = index;
        client.events.set(index, evtName);
        index++;
    });
    console.log(client.events);
});

client.mongoose = require('./utils/mongoose');
client.Guilds = require('./models/guild');
client.UserProfiles = require('./models/user_profile');
client.ActionLogs = require('./models/action_log');

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path+'/'+file).isDirectory();
    });
}

Discord.Message.prototype.getUserFromID = function(mention) {
    const matches = mention.match(/(\d+)/);

    if (!matches) return;

    const id = matches[1];

    return this.client.users.cache.get(id);
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
    
        guild.save().catch(err => console.err(err));
        return guild;
    } else {
        return g;
    }
};

// Helper function to ensure a user is in the user profile; if a user doesn't exist, add them
Discord.GuildMember.prototype.ensure = async function() {
    const mg = require('mongoose');
    const u = await this.client.UserProfiles.findOne({userID: this.id});
    if (!u) {
        const user = new this.client.UserProfiles({
            _id: mg.Types.ObjectId(),
            userID: this.id,
            guildID: this.guild.id,
            totalActions: 0,
            warnings: [],
            kicks: [],
        });

        user.save().catch(err => console.err(err));
        return user;
    } else {
        return u;
    }
};

client.mongoose.init(); // Init database shit
client.login(process.env.TOKEN); // Do I even need to?