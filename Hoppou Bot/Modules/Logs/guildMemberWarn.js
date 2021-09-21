module.exports = {
    name: 'Member Warned',
    eventType: 'guildMemberWarn',
    async event(client, member, moderator, reason) {
        const { MessageEmbed } = require('discord.js');
        const { userMention } = require('@discordjs/builders');

        const logs = await member.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = member.guild.channels.cache.get(log.id);

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Member Warned')
            .setAuthor(moderator.tag, moderator.displayAvatarURL())
            .addField('Member', userMention(member.user.id))
            .addField('Reason', (reason) ? reason : 'No given reason')
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};