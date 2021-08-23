module.exports = {
    eventType: 'guildMemberAdd',
    async event(client, member) {
        const {
            MessageEmbed
        } = require("discord.js");
        const g = await member.guild.ensure();
        const chanl = g.settings.newcommerChannel;
        if (!chanl) {
            return;
        }

        const channel = member.guild.channels.cache.get(chanl);

        const embed = new MessageEmbed()
            .setColor('#9a3deb')
            .setTitle(`New User Joined - ${member.user.tag}`)
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL({
                size: 1024
            }));

        embed.addField(`Account Created`, member.user.createdAt);

        channel.send(embed).then(async (msg) => {
            const mg = require('mongoose');
            const id = mg.Types.ObjectId();
            const log = new msg.client.GuildNewJoins({
                _id: id,
                userID: member.user.id,
                guildID: member.guild.id,
                messageID: msg.id
            });

            msg.react('✅').then(msg.react('🟦')).then(msg.react('❌'));
            await log.save();
        });
    }
};