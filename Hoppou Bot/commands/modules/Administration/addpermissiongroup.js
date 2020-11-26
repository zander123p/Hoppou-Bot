module.exports = {
    name: 'addpermissiongroup',
    description: 'Add a new permission group',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    guildPermission: 'admin.addgroup',
    aliases: ['addpermgroup', 'addgroup'],
    usage: 'p!addpermissiongroup <name> [permissions]\np!addpermissiongroup admin admin.addgroup admin.removegroup admin.addperm',
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

        if (groupExists) return message.reply(`the group '${name}' already exists...`);
        
        guild.permissionGroups.push({name, permissions: (perms)? perms : []});
        await guild.save();

        message.reply(`added the group, '${name}'!`)
    }
}