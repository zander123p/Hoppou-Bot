module.exports = async (client, oldMessage, newMessage) => {
    const { MessageEmbed } = require("discord.js");
    const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');

    if (oldMessage.partial) {
        oldMessage = await oldMessage.fetch();
    }
    if (newMessage.partial) {
        newMessage = await newMessage.fetch();
    }

    if (oldMessage.author.bot || !oldMessage.guild) return;
    const guild = await oldMessage.guild.ensure();
    const chnl = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = oldMessage.guild.channels.cache.get(channelName);

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
};