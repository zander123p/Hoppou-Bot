module.exports = {
    name: 'New Commer Let-In',
    permission: 'mod.letin',
    async event(client, messageReaction, user) {
        if (user.bot) return;

        if (messageReaction.message.partial) await messageReaction.message.fetch();

        const message = messageReaction.message;
        const msg = await client.GuildNewJoins.findOne({ messageID: messageReaction.message.id });
        if (msg) {
            if (await message.guild.members.cache.get(user.id).hasGuildPermission(module.exports.permission)) {
                if (messageReaction.emoji.name === '✅') {
                    message.delete();
                    const member = message.guild.members.cache.get(msg.userID);
                    const g = await message.guild.ensure();
                    member.roles.add(message.guild.roles.cache.get(g.settings.newcommerRole));
                    await client.GuildNewJoins.findOneAndDelete({ messageID: messageReaction.message.id });
                } else if (messageReaction.emoji.name === '❌') {
                    message.delete();
                    const g = await message.guild.ensure();
                    const member = message.guild.members.cache.get(msg.userID);

                    if (g.settings.rejectRole) {
                        member.roles.add(message.guild.roles.cache.get(g.settings.rejectRole));
                    }

                    if (g.settings.rejectChannel) {
                        const { MessageEmbed } = require("discord.js");
                        
                        const embed = new MessageEmbed()
                            .setColor('#9a3deb')
                            .setTitle(`User Rejected - ${member.user.tag}`)
                            .setTimestamp()
                            .setThumbnail(member.user.displayAvatarURL({ size: 1024 }));

                        embed.addField(`Account Created`, member.user.createdAt);

                        message.guild.channels.cache.get(g.settings.rejectChannel).send(embed);
                    }
                    
                    await client.GuildNewJoins.findOneAndDelete({ messageID: messageReaction.message.id });
                }
            }
        }
    }
}