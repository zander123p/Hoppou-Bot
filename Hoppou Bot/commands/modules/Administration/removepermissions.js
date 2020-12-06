module.exports = {
    name: 'removepermissions',
    description: 'Removes permission(s) from a group',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    guildPermission: 'admin.removeperms',
    aliases: ['removeperms'],
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

        if (!guild.permissionGroups.find(g => { if (g.name === name) return g; }).permissions.includes(perms)) return message.reply(`one or more of the permissions are not in this group.`);
        
        guild.permissionGroups.find(g => { if (g.name === name) return g; }).permissions.forEach(p => {
            if (perms.includes(p)) {
                guild.permissionGroups.find(g => { if (g.name === name) return g; }).permissions.splice(guild.permissionGroups.find(g => { if (g.name === name) return g; }).permissions.indexOf(p), 1);
            }
        });
        await guild.save();

        // message.reply(`removed the permissions, '${perms.map(x => (perms.length > 1)? `${x}, ` : `${x}`)}' from the group, '${name}'!`);
        message.react('✅');
    }
}