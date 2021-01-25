module.exports = {
    name: 'unban',
    description: 'Unbans a user',
    guildOnly: true,
    guildPermission: 'mod.unban',
    args: 1,
    usage: '<user>',
    aliases: [],
    async execute(message, args) {
        const user = args[0];

        message.guild.fetchBans().then(bans => {
            if (bans.size === 0) {
                message.reply('there are currently no bans on this server.').then(msg => msg.delete({ timeout: 5000 }));
                return message.react('❌');
            }
            
            let bUser = bans.find(b => b.user.id === user);
            if (!bUser) {
                message.reply('coudn\'t find the specified user; either the user id is invalid or the user isn\'t banned.').then(msg => msg.delete({ timeout: 5000 }));
                return message.react('❌');
            }
            message.guild.members.unban(bUser.user).then(() => {
                message.react('✅');
                message.client.emit('guildBanRemove', message.guild, user, message.author);
            });
        });
    }
}