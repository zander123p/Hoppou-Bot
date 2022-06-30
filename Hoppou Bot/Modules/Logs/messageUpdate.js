module.exports = {
    name: 'Message Changed',
    eventType: 'messageUpdate',
    async event(client, oldMessage, newMessage) {
        const { MessageEmbed } = require('discord.js');
        const { userMention, channelMention } = require('@discordjs/builders');

        if (oldMessage.partial) {
            oldMessage = await oldMessage.fetch();
        }
        if (newMessage.partial) {
            newMessage = await newMessage.fetch();
        }

        if (oldMessage.author.bot || !oldMessage.guild) return;

        const logs = await oldMessage.guild.getModuleSetting(this.module, 'logs');
        if (!logs) return;
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        const c = oldMessage.guild.channels.cache.get(log.id);

        if (oldMessage.content === newMessage.content)
            return;

        const me = new MessageEmbed()
            .setColor('#faea70')
            .setTitle('Message Updated')
            .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL())
            .addField('Message Author', userMention(oldMessage.author.id))
            .addField('Channel', channelMention(oldMessage.channel.id))
            .addField('Before', `${oldMessage}`)
            .addField('After', `${newMessage}`)
            .addField('Jump to message', `[Jump](https://discordapp.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`)
            .setTimestamp();

        c.send({ embeds: [me] });
    },
};