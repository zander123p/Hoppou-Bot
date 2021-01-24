module.exports = {
    name: 'listpermissiongroups',
    description: 'List all permission groups.',
    guildOnly: true,
    guildPermission: 'admin.listpermgroups',
    aliases: ['listpermgroups'],
    async execute(message, args) {
        const { MessageEmbed } = require("discord.js");
        const g = await message.guild.ensure();
        const groups = g.permissionGroups;

        if (groups.length === 0) {
            message.react('❌');
            return message.reply('no valid permission groups found.').then(msg => msg.delete({ timeout: 5000 }));
        }

        const embed = new MessageEmbed()
            .setColor('#faea70')
            .setTitle('Permission Groups');
        
        groups.forEach(group => {
            embed.addField(group.name, group.permissions.map(perm => perm + '\n'));
        });

        message.channel.send(embed);
    }
}