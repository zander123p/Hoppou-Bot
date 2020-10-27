const { MessageEmbed } = require("discord.js");

module.exports = async (client, message) => {
    if (message.author.bot) return;
    const guild = await message.guild.ensure();
    const channelName = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    const channel = message.guild.channels.cache.find(c => c.name === channelName);
    const me = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Message Deleted')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .addField('Channel', message.channel)
        .addField('Message', message)
        .addField('Jump To Message',`https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
        .setTimestamp();
    channel.send(me);
};