module.exports = {
    name: 'lookup',
    description: 'Lookup the provided name for info/ping.',
    guildOnly: true,
    guildPermission: 'mod.lookup',
    args: 1,
    usage: '<user>',
    aliases: ['search'],
    async execute(message, args) {
        const searchTerm = args[0];

        let out = message.guild.members.cache.filter(m => m.user.tag.includes(searchTerm));

        if (out.size === 0) {
            message.reply('no users could be found.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }
        const ListedEmbed = require('../../../utils/listedembed');

        const embed = new ListedEmbed()
        .setTitle(`Lookup for: ${searchTerm}`)
        .setColor('#9a3deb')

        out.forEach(m => {
            embed.addField(`${m.user.tag}`, `<@${m.id}>`, true);
        });

        embed.send(message.channel, 10);
    }
}