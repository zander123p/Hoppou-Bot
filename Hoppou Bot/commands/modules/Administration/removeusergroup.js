module.exports = {
    name: 'removeusergroup',
    description: 'Remove a permission group from a user',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    guildPermission: 'admin.removegroup',
    args: 2,
    usage: '<user> <groups>',
    async execute(message, args) {
        const user = message.guild.members.cache.get(message.getUserFromID(args[0]).id); // User
        const groups = args.slice(1); // Groups

        const u = await user.ensure();

        let groupExists = false;
        u.permissionGroups.forEach(g => {
            if (groups.includes(g)) {
                groupExists = true;
            }
        });

        if (!groupExists) return message.reply(`one or more of the groups '${groups.map(x => x + ', ')}' is not on the user...`);
        
        u.permissionGroups.forEach(group => {
            if (groups.includes(group)) {
                u.permissionGroups.splice(u.permissionGroups.indexOf(group), 1)
            }
        });
        await u.save();

        // message.reply(`removed the group(s), '${groups.map(x => (groups.length > 1)? `${x}, ` : `${x}`)}'!`);
        message.react('✅');
    }
}