module.exports = {
    name: 'setexpmul',
    description: 'Sets the exp multiplier.',
    guildOnly: true,
    guildPermission: 'admin.setexpmul',
    args: 1,
    usage: '<multiplier>',
    async execute(message, args) {
        const c = parseFloat(args[0]);

        if (!c) {
            message.react('❌');
            return message.reply('please enter a valid c value.').then(msg => msg.delete({ timeout: 5000 }));
        }

        const guild = await message.guild.ensure();
        guild.settings.expMul = c;
        await guild.save();
        
        message.react('✅');
    }
}