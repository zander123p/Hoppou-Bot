module.exports = {
    name: 'addusergroup',
    description: 'Add a permission group to a user.',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    guildPermission: 'admin.addusergroup',
    usage: 'p!addusergroup <user> [groups]\np!addusergroup @zander123p admin mod',
    async execute(message, args) {
        const user = message.guild.members.cache.get(message.getUserFromID(args[0]).id); // User
        const groups = args.slice(1); // Groups

        const u = await user.ensure();

        if (!u.permissionGroups) u.permissionGroups = [];

        u.permissionGroups = u.permissionGroups.concat(groups);
        await u.save();

        message.reply(`added ${user} to the group(s), '${groups.map(x => (groups.length > 1)? `${x}, ` : `${x}`)}'!`)
    }
}