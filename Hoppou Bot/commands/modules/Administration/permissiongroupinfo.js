module.exports = {
    name: 'permissiongroupinfo',
    description: 'Get information about a permission group',
    guildOnly: true,
    guildPermission: 'admin.permgroupinfo',
    args: 1,
    usage: '<group> [permissions] | [blacklist]',
    aliases: ['permgroupinfo', 'pgi'],
    async execute(message, args) {
        const ListedEmbed = require('../../../utils/listedembed');

        const name = args[0].toLowerCase(); // Name
        const guild = await message.guild.ensure();

        let group;
        guild.permissionGroups.forEach(g => {
            if (g.name === name) {
                group = g;
            }
        });

        if (!group) {
            message.reply('please enter a valid group.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        if (args[1]) {
            if (args[1].toLowerCase() === 'permissions') {
                if (group.permissions.length === 0) {
                    message.reply('this group does not have any permissions.').then(msg => msg.delete({ timeout: 5000 }));
                    return message.react('❌');
                }

                const embed = new ListedEmbed()
                    .setColor('#9a3deb')
                    .setTitle(`${group.name[0].toUpperCase() + group.name.substring(1)} - Permissions`);

                group.permissions.forEach(perm => {
                    embed.addField(perm, `⠀`);
                });

                embed.send(message.channel, 5);
                return;
            } else if (args[1].toLowerCase() === 'blacklist') {
                if (group.blacklist.length === 0) {
                    message.reply('this group does not have any blacklists.').then(msg => msg.delete({ timeout: 5000 }));
                    return message.react('❌');
                }
                const embed = new ListedEmbed()
                    .setColor('#9a3deb')
                    .setTitle(`${group.name[0].toUpperCase() + group.name.substring(1)} - Blacklist`);

                group.blacklist.forEach(perm => {
                    embed.addField(perm, `⠀`);
                });

                embed.send(message.channel, 5);
                return;
            }
        }

        const embed = new ListedEmbed()
            .setColor('#9a3deb')
            .setTitle(group.name[0].toUpperCase() + group.name.substring(1));
        
        embed.addField(`Role`, message.guild.roles.cache.get(group.role), true);

        embed.send(message.channel, 10);
    }
}