module.exports = {
    eventType: 'messageCreate',
    async event(client, message) {
        if (message.author.bot) return;
        if (!message.guild) return;
        const user = await message.guild.members.cache.get(message.author.id).ensure();
        const member = await message.guild.members.cache.get(message.author.id);

        const rankupChannel = await message.guild.getModuleSetting(this.module, 'levelup_channel');
        const levelupRole = await message.guild.getModuleSetting(this.module, 'levelup_role');
        if (rankupChannel) {
            if (!user.exp) user.exp = 0;

            if (client.cooldowns.get(message.author.id)) {
                console.log('User is on cooldown');
                return;
            } else {
                client.cooldowns.set(message.author.id, true);
                setTimeout(() => {
                    client.cooldowns.delete(message.author.id);
                }, 1500);
            }

            if (levelupRole) {
                const role = member.roles.cache.find(r => r.id === levelupRole);
                if (!role) return;
            }

            const oldLevel = await member.getLevel();
            const expMul = await message.guild.getModuleSetting(this.module, 'experience_multiplier');
            user.exp += 1 * (expMul) ? expMul : 1;
            await user.save();
            const newLevel = await member.getLevel();
            if (newLevel > oldLevel) {
                const channel = message.guild.channels.cache.get(rankupChannel);
                const {
                    MessageEmbed,
                } = require('discord.js');
                const embed = new MessageEmbed()
                    .setColor('#9a3deb')
                    .setTitle('Level up')
                    .setTimestamp()
                    .setThumbnail(member.user.displayAvatarURL({
                        size: 1024,
                    }));

                embed.addField('Level', newLevel.toString());

                channel.send(`${member.user}, you leveled up!`);
                channel.send({ embeds: [embed] });

                client.emit('guildMemberLevelup', member, message.guild);
            }
        }
    },
};