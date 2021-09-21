module.exports = {
    name: 'Member Muted',
    eventType: 'guildMemberMute',
    async event(client, member, moderator, duration) {
        const { MessageEmbed } = require('discord.js');
        const { userMention } = require('@discordjs/builders');

        const logs = await member.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = member.guild.channels.cache.get(log.id);

        const meU = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Member Muted')
            .setAuthor(moderator.tag, moderator.displayAvatarURL())
            .addField('Member', userMention(member.user.id))
            .addField('Duration', duration)
            .setTimestamp();

        c.send({ embeds: [meU] });
    },
};