module.exports = {
    name: 'setprefix',
    description: 'Set the prefix for the server',
    guildOnly: true,
    guildPermission: 'admin.setprefix',
    args: 1,
    usage: '<prefix>',
    aliases: [],
    async execute(message, args) {
        const prefix = args[0];
        const g = await message.guild.ensure();

        if (prefix === 'reset') {
            g.settings.prefix = 'p!';
        } else {
            g.settings.prefix = prefix;
        }

        await g.save();
        message.react('✅');
    }
}