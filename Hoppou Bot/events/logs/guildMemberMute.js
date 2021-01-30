module.exports = async (client, member, moderator, duration) => {
    const { MessageEmbed } = require("discord.js");
    const g = await member.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = member.guild.channels.cache.get(channelName);

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Member Muted')
        .setAuthor(moderator.tag, moderator.displayAvatarURL())
        .addField('Member', member.user)
        .addField('Duration', duration)
        .setTimestamp();    

    c.send(meU);
};