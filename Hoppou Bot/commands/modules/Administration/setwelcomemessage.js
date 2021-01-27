module.exports = {
    name: 'setwelcomemessage',
    description: 'Sets the message to be used when people are welcomed into the server.\nUse <@user> in place of the user, <@server> in place of the guild and <@count> in place of the total members.',
    guildOnly: true,
    guildPermission: 'admin.setwelcomemessage',
    args: 1,
    usage: '<message>...',
    async execute(message, args) {
        const msg = args.join(' ');

        const g = await message.guild.ensure();

        g.settings.welcomeMessage = msg;
        await g.save();

        message.react('✅');
    }
}