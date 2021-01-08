module.exports = {
    name: 'setpermissionrole',
    description: 'Set the role for a permission group.',
    guildOnly: true,
    guildPermission: 'admin.setpermrole',
    args: 1,
    usage: '<permission group> <role>',
    aliases: ['setpermrole'],
    async execute(message, args) {
        // Retrieve role from arg 2
        const roleID = args[1].match(/^<@&?(\d+)>$/)[1]; // Match for @role.
        if (!roleID) {
            message.reply('please enter a valid role.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }
        const role = message.guild.roles.cache.get(roleID);

        // Retrieve permission group from arg 1
        const g = await message.guild.ensure();
        const group = g.permissionGroups.find(G => G.name === args[0]);
        if (!group) {
            message.reply('please enter a valid group.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        g.permissionGroups[g.permissionGroups.indexOf(group)].role = roleID;
        await g.save();
        message.react('✅');
    }
}