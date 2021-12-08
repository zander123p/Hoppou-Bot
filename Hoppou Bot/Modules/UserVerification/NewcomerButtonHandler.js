module.exports = {
    name: 'NewcomerButtonHandler',
    permission: 'mod.letin',
    async event(interaction, id) {
        const client = interaction.client;
        const moderator = interaction.member;

        const message = interaction.message;
        const msg = await client.GuildNewJoins.findOne({ messageID: message.id });

        if (msg) {
            if (await moderator.hasGuildPermission(this.permission)) {
                if (id === 'accept') {
                    const member = await moderator.guild.members.fetch(msg.userID);
                    member.roles.add(moderator.guild.roles.cache.get(await moderator.guild.getModuleSetting(this.module, 'newcomer_role')));
                    await client.GuildNewJoins.findOneAndDelete({ messageID: message.id });
                    message.delete();
                    client.emit('userVerificationAccept', member, moderator);
                } else if (id === 'deny') {
                    const member = await moderator.guild.members.fetch(msg.userID);

                    const rejectRole = await moderator.guild.getModuleSetting(this.module, 'reject_role');
                    const rejectChannel = await moderator.guild.getModuleSetting(this.module, 'reject_channel');

                    if (rejectRole) {
                        member.roles.add(moderator.guild.roles.cache.get(rejectRole));
                    }

                    if (rejectChannel) {
                        const { MessageEmbed } = require('discord.js');
                        const { userMention } = require('@discordjs/builders');

                        const embed = new MessageEmbed()
                            .setColor('#9a3deb')
                            .setTitle(`User Rejected - ${member.user.tag}`)
                            .setTimestamp()
                            .setThumbnail(member.user.displayAvatarURL({ size: 1024 }));

                        embed.addField('Account Created', member.user.createdAt.toString());
                        embed.addField('Moderator', userMention(moderator.user.id));

                        message.guild.channels.cache.get(rejectChannel).send({ embeds: [embed] });
                    }

                    await client.GuildNewJoins.findOneAndDelete({ messageID: message.id });
                    message.delete();
                    client.emit('userVerificationReject', member, moderator);
                }
            }
        }
    },
};