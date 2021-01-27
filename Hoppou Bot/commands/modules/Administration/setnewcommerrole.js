module.exports = {
    name: 'setnewcommerrole',
    description: 'Sets the role to be given for when people join that need to be accepted in to the server.',
    guildOnly: true,
    guildPermission: 'admin.setnewcommerrole',
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

        g.settings.newcommerRole = role.id;
        await g.save();

        message.react('✅');
    }
}