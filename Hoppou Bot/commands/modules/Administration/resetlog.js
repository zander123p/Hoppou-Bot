module.exports = {
    name: 'resetlog',
    description: 'Reset any log ids supplied.',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    args: 1,
    usage: '<log id>..\np!setlog 1 2 3',
    async execute(message, args) {
        const logs = args.map(x => +x);
        const guild = await message.guild.ensure();
        
        guild.settings.channels.forEach(c => {
            logs.forEach(l => {
                if (c.logs.includes(l)) {
                    c.logs.splice(c.logs.indexOf(l), 1);
                }
            });
        });

        await guild.save();
        message.channel.send(`I've reset the log id(s): '${logs}'`);
    }
}