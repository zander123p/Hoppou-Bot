module.exports = {
    name: 'listpermissiongroups',
    description: 'List all permission groups.',
    guildOnly: true,
    guildPermission: 'admin.listpermgroups',
    aliases: ['listpermgroups'],
    async execute(message, args) {
        const ListedEmbed = require('../../../utils/listedembed');
        const g = await message.guild.ensure();
        const groups = g.permissionGroups;

        if (groups.length === 0) {
            message.react('❌');
            return message.reply('no valid permission groups found.').then(msg => msg.delete({ timeout: 5000 }));
        }

        const embed = new ListedEmbed()
            .setColor('#faea70')
            .setTitle('Permission Groups');
        
        groups.forEach(group => {
            let name = group.name[0].toUpperCase() + group.name.substring(1);
            embed.addField(name, group.permissions.map(perm => perm + '\n'));
        });

        embed.send(message.channel, 10);
    }
}