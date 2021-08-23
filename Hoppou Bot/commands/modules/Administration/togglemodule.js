module.exports = {
    name: 'togglemodule',
    description: 'Toggle a module of the bot.',
    guildOnly: true,
    guildPermission: 'admin.toggleModule',
    args: 1,
    usage: '<module>',
    async execute(message, args) {
        const name = args[0];

        const guild = await message.guild.ensure();

        guild.settings.modules.forEach(async m => {
            if (m === name) {
                guild.settings.modules.splice(guild.modules.indexOf(m), 1);
                await guild.save();
                return message.react('✅');
            } else if (isValidModule(name)) {
                guild.settings.modules.push(name);
                await guild.save();
                return message.react('✅');
            } else {
                message.reply('please enter a valid module.').then(msg => msg.delete({ timeout: 5000 }));
                return message.react('❌');
            }
        });

        if (guild.settings.modules.length === 0 && isValidModule(name)) {
            guild.settings.modules = [name];
            await guild.save();
            return message.react('✅');
        }
    },
};

function isValidModule(m) {
    const modules = getDirectories('./Modules');
    return modules.find(d => d.toLowerCase() === m.toLowerCase());
}

// Gets all directories in a path
function getDirectories(path) {
    const fs = require('fs');
    return fs.readdirSync(path).filter(function(file) {
      return fs.statSync(path + '/' + file).isDirectory();
    });
}