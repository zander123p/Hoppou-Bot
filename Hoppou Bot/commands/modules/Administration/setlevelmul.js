module.exports = {
    name: 'setlevelmul',
    description: 'Sets the level \'c\' value that\'s used in the level calculation. This can be used to make levels easier to harder to get.',
    guildOnly: true,
    guildPermission: 'admin.setmute',
    args: 1,
    usage: '<c value>',
    aliases: ['setmute'],
    async execute(message, args) {
        const c = parseFloat(args[0]);

        if (!c) {
            message.react('❌');
            return message.reply('please enter a valid c value.').then(msg => msg.delete({ timeout: 5000 }));
        }

        const guild = await message.guild.ensure();
        guild.settings.levelMul = c;
        await guild.save();
        
        message.react('✅');
    }
}