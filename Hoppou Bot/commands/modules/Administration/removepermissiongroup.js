module.exports = {
    name: 'removepermissiongroup',
    description: 'Remove a new permission group',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    guildPermission: 'admin.removegroup',
    aliases: ['removepermgroup', 'removegroup'],
    usage: 'p!removepermissiongroup <name>\np!addpermissiongroup admin admin.addgroup admin.removegroup admin.addperm',
    async execute(message, args) {
        const name = args[0]; // Name

        const guild = await message.guild.ensure();

        let groupExists = false;
        guild.permissionGroups.forEach(g => {
            if (g.name === name) {
                groupExists = true;
            }
        });

        if (!groupExists) return message.reply(`the group '${name}' does not exist...`);
        
        guild.permissionGroups.forEach(group => {
            if (group.name === name) {
                guild.permissionGroups.splice(guild.permissionGroups.indexOf(group), 1)
            }
        });
        await guild.save();

        message.reply(`removed the group, '${name}'!`)
    }
}