module.exports = {
    name: 'kick',
    description: 'Kick the provided user with a reason',
    guildOnly: true,
    guildPermission: 'mod.kick',
    args: 2,
    usage: '<user> <reason>...',
    async execute(message, args) {
        const user = await message.getUserFromID(args[0]);

        if (!user) {
            message.reply('please enter a valid user.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const gUser = message.guild.members.cache.get(user.id);
        const reason = args.slice(1).join(' ');

        if (gUser.kickable) {
            gUser.kick(reason).then(() => {
                message.react('✅');
                message.client.emit('guildMemberKick', gUser, message.author);
            });
        } else {
            message.reply('user cannot be kicked.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }
    }
}