module.exports = {
    name: 'info',
    description: 'Info about Hoppou Bot',
    async execute(interaction) {
        const { MessageEmbed } = require('discord.js');

        const embed = new MessageEmbed()
            .setColor('#9a3deb')
            .setTitle('Hoppou Bot');

        const version = await interaction.client.getVersion();
        embed.addField('Links', '[Source Code](https://github.com/zander123p/Hoppou-Bot)\n[Report Bug](https://github.com/zander123p/Hoppou-Bot/issues/new?assignees=&labels=&template=bug_report.md&title=%5BBUG%5D)\n[Request Feature](https://github.com/zander123p/Hoppou-Bot/issues/new?assignees=zander123p&labels=enhancement&template=feature_request.md&title=%5BFEATURE+REQUEST%5D)');
        embed.setFooter(`By zander123p - Version ${version}`);
        interaction.reply({ embeds: [embed] });
    },
};