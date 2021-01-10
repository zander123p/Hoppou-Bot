module.exports = {
    name: 'resetlog',
    description: 'Reset any log ids supplied.',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    guildPermission: 'admin.resetlog',
    args: 1,
    usage: '<log id>',
    async execute(message, args) {
        const logs = args.slice(0).map(x => message.client.events.get(+x)); // Anything else
        const guild = await message.guild.ensure();
        
        guild.settings.channels.forEach(c => {
            logs.forEach(l => {
                if (c.logs.includes(l)) {
                    c.logs.splice(c.logs.indexOf(l), 1);
                }
            });
            if (c.logs.length === 0) {
                guild.settings.channels.splice(guild.settings.channels.indexOf(c), 1);
            }
        });

        await guild.save();
        // message.channel.send(`I've reset the log id(s): '${logs}'`);
        message.react('✅');
    }
}