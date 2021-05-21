module.exports = {
    name: 'removerank',
    description: 'Removes a rank from the rankup module.',
    guildOnly: true,
    guildPermission: 'admin.removeRank',
    args: 1,
    usage: '<role id>',
    async execute(message, args) {
        const role = args[0].match(/^<@&?(\d+)>$/)[1]; // Role ID

        const g = await message.guild.ensure();

        if (!role) {
            message.reply('invalid role.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }
        
        if (!g.settings.ranks.find(r => r.id === role)) {
            message.reply('this rank doesn\'t exist.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        let rank = g.settings.ranks.find(r => r.id === role);

        g.settings.ranks.splice(g.ranks.indexOf(rank), 1);

        await g.save();

        message.react('✅');
    }
}