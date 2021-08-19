module.exports = async (client, member) => {
    const { MessageEmbed } = require("discord.js");
    const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');
    const g = await member.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = member.guild.channels.cache.get(channelName);

    const me = new MessageEmbed()
        .setColor('#70f567')
        .setTitle('Member Joined')
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .addField('Member', userMention(member.user.id))
        .setTimestamp();

    c.send({ embeds: [me] });
};