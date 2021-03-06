module.exports = async (client, message) => {
    const { MessageEmbed } = require("discord.js");
    const g = await message.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = message.guild.channels.cache.get(channelName);

    const me = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Message Reactions Removed')
        .addField('Message', message)
        .addField('Jump To Message',`https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
        .setTimestamp();

    c.send(me);
};