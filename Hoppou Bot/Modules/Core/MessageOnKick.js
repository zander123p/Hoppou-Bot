module.exports = {
    eventType: 'guildMemberKick',
    async event(client, member) {
        const { MessageEmbed } = require('discord.js');

        const guild = member.guild;
        const user = member.user;
        const msgFlag = await guild.getModuleSetting(this.module, 'message_user');

        if (!msgFlag || user.bot) return;

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });

        const channelLog = fetchedLogs.entries.first();

        const embed = new MessageEmbed()
            .setColor('#9a3deb')
            .setTitle('You have been kicked')
            .setTimestamp()
            .addField('Guild', guild.name)
            .addField('Reason', channelLog.reason ? channelLog.reason : 'No reason was given');

        user.createDM().then((c) => {
            c.send({ embeds: [embed] });
        });
    },
};