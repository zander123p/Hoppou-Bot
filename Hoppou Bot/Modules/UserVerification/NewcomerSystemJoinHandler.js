module.exports = {
    eventType: 'guildMemberAdd',
    async event(client, member) {
        const {
            MessageEmbed,
            MessageActionRow,
            MessageButton,
        } = require('discord.js');
        const chanl = await member.guild.getModuleSetting(this.module, 'newcomer_channel');
        if (!chanl) {
            return;
        }

        const channel = member.guild.channels.cache.get(chanl);

        const embed = new MessageEmbed()
            .setColor('#9a3deb')
            .setTitle(`New User Joined - ${member.user.tag}`)
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL({
                size: 1024,
            }));

        embed.addField('Account Created', member.user.createdAt.toString());

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`${this.module}-newcomerbuttonhandler-accept`)
                    .setLabel('Accept')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId(`${this.module}-newcomerbuttonhandler-deny`)
                    .setLabel('Deny')
                    .setStyle('DANGER'),
            );

        channel.send({ embeds: [embed], components: [row] }).then(async (msg) => {
            const mg = require('mongoose');
            const id = mg.Types.ObjectId();
            const log = new msg.client.GuildNewJoins({
                _id: id,
                userID: member.user.id,
                guildID: member.guild.id,
                messageID: msg.id,
            });

            await log.save();
        });
    },
};