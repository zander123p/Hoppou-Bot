module.exports = {
    name: 'addblacklist',
    description: 'Adds permission(s) to a group\'s blacklist',
    guildOnly: true,
    guildPermission: 'admin.addblacklist',
    args: 2,
    usage: '<name> <permissions>',
    async execute(message, args) {
        const name = args[0]; // Name
        const perms = args.slice(1); // Permissions

        const guild = await message.guild.ensure();

        let groupExists = false;
        guild.permissionGroups.forEach(g => {
            if (g.name === name) {
                groupExists = true;
            }
        });

        if (!groupExists) {
            message.reply('please enter a valid group.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        if (guild.permissionGroups.find(g => { if (g.name === name) return g; }).blacklist.includes(perms)) {
            message.reply('one or more of the permissions are already in this group\'s blacklist.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }
        guild.permissionGroups.find(g => { if (g.name === name) return g; }).blacklist = guild.permissionGroups.find(g => { if (g.name === name) return g; }).blacklist.concat(perms);
        await guild.save();

        // message.reply(`added the permissions, '${perms.map(x => (perms.length > 1)? `${x}, ` : `${x}`)}' to the group, '${name}'!`);
        message.react('✅');
    }
}