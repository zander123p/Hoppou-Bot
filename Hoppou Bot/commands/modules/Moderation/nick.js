module.exports = {
    name: 'nick',
    description: 'Change a user\'s nickname.',
    guildOnly: true,
    guildPermission: 'mod.nick',
    args: 2,
    usage: '<user> <nickname>',
    aliases: ['rename'],
    async execute(message, args) {
        const user = await message.getUserFromID(args[0]);
        if (!user) {
            message.reply('please enter a valid user.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const gUser = message.guild.members.cache.get(user.id);

        await gUser.setNickname(args[1]);
        message.react('✅');
    }
}