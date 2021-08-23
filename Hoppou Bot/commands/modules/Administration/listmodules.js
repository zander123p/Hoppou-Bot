module.exports = {
    name: 'listmodules',
    description: 'List all modules in hoppou bot; active modules will be shown as such.',
    guildOnly: true,
    guildPermission: 'admin.listmodules',
    async execute(message, args) {
        const ListedEmbed = require('../../../utils/listedembed');
        const g = await message.guild.ensure();

        const embed = new ListedEmbed()
        .setColor('#9a3deb')
        .setTitle(`Hoppou Bot Modules`);

        message.client.modules.forEach(mod => {
            embed.addField(`${mod}`, g.settings.modules.includes(mod)? `ACTIVE` : `INACTIVE`);
        });

        embed.send(message.channel, 5);
    }
}