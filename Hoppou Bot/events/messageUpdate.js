module.exports = async (client, oldMessage, newMessage) => {
    const { MessageEmbed } = require("discord.js");
    if (oldMessage.author.bot || !oldMessage.guild) return;
    const guild = await oldMessage.guild.ensure();
    const channelName = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    if (!channelName) return;
    const channel = oldMessage.guild.channels.cache.find(c => c.name === channelName);

    const me = new MessageEmbed()
        .setColor('#faea70')
        .setTitle('Message Updated')
        .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL())
        .addField('Channel', oldMessage.channel)
        .addField('Message', `${oldMessage} -> ${newMessage}`)
        .addField('Jump To Message',`https://discordapp.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`)
        .setTimestamp();

    channel.send(me);
};