module.exports = {
    eventType: 'guildBanAdd',
    async event(client, ban) {
        const { MessageEmbed } = require('discord.js');

        const guild = ban.guild;
        const user = ban.user;
        const reason = ban.reason;
        const msgFlag = await guild.getModuleSetting(this.module, 'message_user');

        if (!msgFlag || user.bot) return;

        const embed = new MessageEmbed()
            .setColor('#9a3deb')
            .setTitle('You have been banned')
            .setTimestamp()
            .addField('Guild', guild.name)
            .addField('Reason', reason);

        user.createDM().send({ embeds: [embed] });
    },
};