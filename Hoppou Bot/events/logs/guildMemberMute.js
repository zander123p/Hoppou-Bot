module.exports = async (client, member, moderator, duration) => {
    const { MessageEmbed } = require("discord.js");
    const { userMention, memberNicknameMention, channelMention, roleMention } = require('@discordjs/builders');
    const g = await member.guild.ensure();
    const chnl = g.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; });
    if (!chnl) return;
    const channelName = chnl.name;
    const c = member.guild.channels.cache.get(channelName);

    const meU = new MessageEmbed()
        .setColor('#db4444')
        .setTitle('Member Muted')
        .setAuthor(moderator.tag, moderator.displayAvatarURL())
        .addField('Member', userMention(member.user.id))
        .addField('Duration', duration)
        .setTimestamp();

    c.send({ embeds: [meU] });
};