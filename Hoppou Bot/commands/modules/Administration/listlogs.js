module.exports = {
    name: 'listlogs',
    description: 'List all log ids; active log ids will be shown as such.',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    usage: 'p!setlog',
    async execute(message, args) {
        const guild = await message.guild.ensure();
        // let list = message.client.events.map(c => { return c.logs.map(l => { return l.toString() + '\n'; }).toString(); });
        let activeLogs = [];
        guild.settings.channels.forEach(c => {
            c.logs.forEach(l => {
                activeLogs.push(l);
            });
        });
        let list = '';
        Array.from(message.client.events.keys()).forEach(k => {
            if (activeLogs.includes(k)) {
                list += k + ': ' + message.client.events.get(k) + '|ACTIVE\n';
            } else {
                list += k + ': ' + message.client.events.get(k) + '\n';
            }
        });
        message.channel.send(`Here is the log id list: \`\`\`${list}\`\`\``);
    }
}