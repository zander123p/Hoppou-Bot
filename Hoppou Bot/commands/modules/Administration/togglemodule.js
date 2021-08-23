module.exports = {
    name: 'togglemodule',
    description: 'Toggle a module of the bot.',
    guildOnly: true,
    guildPermission: 'admin.toggleModule',
    args: 1,
    usage: '<module>',
    async execute(message, args) {
        const name = args[0]; // Module

        const guild = await message.guild.ensure();

        if (guild.settings.modules.length === 0 && isValidModule(name)) {
            guild.settings.modules = [name];
            console.log('Test 1');
            await guild.save();
            return message.react('✅');
        } else if (!guild.settings.modules.includes(name)) {
            guild.settings.modules.push(name);
            await guild.save();
            return message.react('✅');
        }
        
        let success = false;
        guild.settings.modules.forEach(async m => {
            if (m === name) {
                guild.settings.modules.splice(guild.settings.modules.indexOf(m), 1);
                success = true;
                await guild.save();
                return message.react('✅');
            }
        });
        
        if (!success) {
            message.reply('please enter a valid module.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }
    }
}

function isValidModule(m) {
    let modules = getDirectories('./Modules');
    return modules.find(d => d.toLowerCase() === m.toLowerCase());
}

// Gets all directories in a path
function getDirectories(path) {
    const fs = require('fs');
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path+'/'+file).isDirectory();
    });
}
