module.exports = {
    name: 'ban',
    description: 'Bans a user with a reason',
    guildOnly: true,
    guildPermission: 'mod.ban',
    args: 1,
    usage: '<user> <reason>...',
    aliases: [],
    async execute(message, args) {
        const user = await message.getUserFromID(args[0]);

        if (!user) {
            message.reply('please enter a valid user.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const gUser = message.guild.members.cache.get(user.id);
        const reason = args.slice(1).join(' ');

        if (gUser.bannable) {
            gUser.ban({ reason }).then(() => {
                message.react('✅');
                message.client.emit('guildBanAdd', message.guild, user, message.author);
            });
        } else {
            message.reply('user cannot be banned.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }
    }
}