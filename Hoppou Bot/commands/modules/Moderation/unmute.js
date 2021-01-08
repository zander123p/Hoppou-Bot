module.exports = {
    name: 'unmute',
    description: 'Unmute a muted member.',
    guildOnly: true,
    guildPermission: 'mod.unmute',
    args: 1,
    usage: '<user>',
    aliases: [],
    async execute(message, args) {
        const g = await message.guild.ensure();
        const user = await message.getUserFromID(args[0]);

        if (!user) {
            message.reply('please enter a valid user.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const gUser = message.guild.members.cache.get(user.id);

        const del = await message.client.MuteLogs.findOne({ userID: gUser.id, guildID: gUser.guild.id });

        if (!del) {
            message.reply('specified user was not found to be muted.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        await message.client.MuteLogs.findOneAndDelete({ userID: gUser.id, guildID: gUser.guild.id }, async (err) => {
            gUser.roles.remove(message.guild.roles.cache.get(g.settings.muteRole));
        });

        message.react('✅');
    }
}