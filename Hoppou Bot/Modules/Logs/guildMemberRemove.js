module.exports = {
    name: 'Member Leave',
    eventType: 'guildMemberRemove',
    async event(client, member) {
        const { MessageEmbed } = require('discord.js');
        const { userMention } = require('@discordjs/builders');

        const logs = await member.guild.getModuleSetting(this.module, 'logs');
        if (!logs) return;
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        const c = member.guild.channels.cache.get(log.id);

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Member Left')
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .addField('Member', userMention(member.user.id))
            .setTimestamp();

        c.send({ embeds: [me] });
    },
};