module.exports = {
    name: 'removepermissiongroup',
    description: 'Remove a permission group',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    guildPermission: 'admin.removegroup',
    aliases: ['removepermgroup', 'removegroup'],
    args: 1,
    usage: '<name>',
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

        // message.reply(`removed the group, '${name}'!`)
        message.react('✅');
    }
}