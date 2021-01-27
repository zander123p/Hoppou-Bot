module.exports = {
    name: 'setrejectrole',
    description: 'Sets the role to be given to users that are rejected.',
    guildOnly: true,
    guildPermission: 'admin.setrejectrole',
    args: 1,
    usage: '<role>',
    async execute(message, args) {
        const r = args[0].match(/^<@&?(\d+)>$/)[1]; // Match for #channel-name
        const role = message.guild.roles.cache.get(r);

        if (!role) {
            message.reply('please input a valid role').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const g = await message.guild.ensure();

        g.settings.rejectRole = role.id;
        await g.save();

        message.react('✅');
    }
}