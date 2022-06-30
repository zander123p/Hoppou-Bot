module.exports = {
    name: 'Message Reactions Removed',
    eventType: 'messageReactionRemoveAll',
    async event(client, message) {
        const { MessageEmbed } = require('discord.js');

        const logs = await message.guild.getModuleSetting(this.module, 'logs');
        if (!logs) return;
        const log = logs.find(l => l.logs.includes(this.name.toLowerCase()));
        const c = message.guild.channels.cache.get(log.id);

        const me = new MessageEmbed()
            .setColor('#db4444')
            .setTitle('Message Reactions Removed')
            .addField('Message', message)
            .addField('Jump To Message', `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
            .setTimestamp();

        c.send({ embeds: [me] });
    },
};