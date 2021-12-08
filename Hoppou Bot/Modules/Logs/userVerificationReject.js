module.exports = {
    name: 'User Rejected',
    eventType: 'userVerificationReject',
    async event(client, member, moderator) {
        const { MessageEmbed } = require('discord.js');
        const { userMention } = require('@discordjs/builders');

        const logs = await member.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = member.guild.channels.cache.get(log.id);

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('User Rejected')
            .setAuthor(moderator.user.tag, moderator.user.displayAvatarURL())
            .addField('User', userMention(member.user.id))
            .setTimestamp();
        c.send({ embeds: [meU] });
    },
};