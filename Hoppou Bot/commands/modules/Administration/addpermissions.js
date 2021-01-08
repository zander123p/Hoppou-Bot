module.exports = {
    name: 'addpermissions',
    description: 'Adds permission(s) to a group',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    guildPermission: 'admin.addperms',
    aliases: ['addperms'],
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

        if (!groupExists) return message.reply(`the group '${name}' does not exist...`);

        if (guild.permissionGroups.find(g => { if (g.name === name) return g; }).permissions.includes(perms)) return message.reply(`one or more of the permissions are already in this group.`);
        
        guild.permissionGroups.find(g => { if (g.name === name) return g; }).permissions = guild.permissionGroups.find(g => { if (g.name === name) return g; }).permissions.concat(perms);
        await guild.save();

        // message.reply(`added the permissions, '${perms.map(x => (perms.length > 1)? `${x}, ` : `${x}`)}' to the group, '${name}'!`);
        message.react('✅');
    }
}