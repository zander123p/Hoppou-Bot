module.exports = async (client, member) => {
    const { MessageEmbed } = require("discord.js");
    const g = await member.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    const channelName = chnl.name;
    if (!channelName) return;
    const c = member.guild.channels.cache.get(channelName);

    const me = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Member Joined')
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .addField('Member', member.user)
        .setTimestamp();
    
    c.send(me);
};