module.exports = {
    name: 'setmuterole',
    description: 'Sets the role to use when muting a user.',
    guildOnly: true,
    guildPermission: 'admin.setmute',
    args: 1,
    usage: '<role>',
    aliases: ['setmute'],
    async execute(message, args) {
        const match = args[0].match(/^<@&?(\d+)>$/);
        if (!match) {
            message.react('❌');
            message.reply('please enter a valid role.').then(msg => msg.delete({ timeout: 5000 }));
            return;
        }
        const role = match[1];

        const guild = await message.guild.ensure();
        guild.settings.muteRole = role;
        await guild.save();
        
        message.react('✅');
    }
}