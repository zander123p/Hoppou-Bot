module.exports = {
    name: 'listlogs',
    description: 'List all log ids; active log ids will be shown as such.',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    guildPermission: 'admin.listlogs',
    usage: '[log]',
    async execute(message, args) {
        const ListedEmbed = require('../../../utils/listedembed');
        const guild = await message.guild.ensure();
        // let list = message.client.events.map(c => { return c.logs.map(l => { return l.toString() + '\n'; }).toString(); });
        let activeLogs = [];
        guild.settings.channels.forEach(c => {
            c.logs.forEach(l => {
                activeLogs.push({log: l, channel: c.name});
            });
        });

        let log = args[0];
        if (log) {
            log = log.toLowerCase();
            if (Array.from(message.client.events.values()).map(x => x.toLowerCase()).includes(log)) {
                const embed = new ListedEmbed()
                    .setColor('#9a3deb')
                    .setTitle(`Logs - ${message.client.events.find(x => x.toLowerCase() === log)[0].toUpperCase() + message.client.events.find(x => x.toLowerCase() === log).substring(1)}`);
                
                let actLog = activeLogs.find(x => x.log.toLowerCase() === log);
                if (actLog) {
                    embed.addField(`State`, `ACTIVE`);
                    embed.addField(`Channel`, message.guild.channels.cache.get(actLog.channel));
                } else {
                    embed.addField(`State`, `INACTIVE`);
                }
                embed.send(message.channel, 5);
            } else {
                message.reply('please enter a valid log.').then(msg => msg.delete({ timeout: 5000 }));
                return message.react('❌');
            }
            return;
        }

        const embed = new ListedEmbed()
            .setColor('#9a3deb')
            .setTitle('Logs');

        Array.from(message.client.events.keys()).forEach(k => {
            if (activeLogs.find(x => x.log === message.client.events.get(k))) {
                embed.addField(k + ': ' + message.client.events.get(k)[0].toUpperCase() + message.client.events.get(k).substring(1), 'ACTIVE');
            } else {
                embed.addField(k + ': ' + message.client.events.get(k)[0].toUpperCase() + message.client.events.get(k).substring(1), 'INACTIVE');
            }
        });

        embed.send(message.channel, 5);
    }
}