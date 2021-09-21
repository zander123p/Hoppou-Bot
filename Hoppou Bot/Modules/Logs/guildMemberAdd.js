module.exports = {
    name: 'Member Joined',
    eventType: 'guildMemberAdd',
    async event(client, member) {
        const { MessageEmbed } = require('discord.js');
        const { userMention } = require('@discordjs/builders');

        const logs = await member.guild.getModuleSetting(this.module, 'logs');
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        if (!log) return;
        const c = member.guild.channels.cache.get(log.id);

        const me = new MessageEmbed()
            .setColor('#70f567')
            .setTitle('Member Joined')
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .addField('Member', userMention(member.user.id))
            .setTimestamp();

        c.send({ embeds: [me] });
    },
};