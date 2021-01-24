module.exports = {
    name: 'userinfo',
    description: 'Get information on the target user',
    guildOnly: true,
    guildPermission: 'mod.userinfo',
    args: 1,
    usage: '<user>',
    aliases: ['ui'],
    async execute(message, args) {
        const { MessageEmbed } = require("discord.js");
        const user = await message.getUserFromID(args[0]);

        if (!user) {
            message.reply('please enter a valid user.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        if (user.bot) {
            message.reply('this user is a bot.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const gUser = message.guild.members.cache.get(user.id);
        const u = await gUser.ensure();

        const embed = new MessageEmbed()
            .setTitle(user.tag)
            .setColor('#9a3deb')
            .setThumbnail(user.displayAvatarURL({size: 1024}));

        embed.addField(`Account Created`, user.createdAt, true);
        embed.addField(`Joined Server`, gUser.joinedAt, true);
        if (u.permissionGroups.length > 0)
            embed.addField(`Permission Groups`, u.permissionGroups.map(group => group + '\n'), true);
        embed.addField(`Total Messages Sent`, u.messages, true);
        const profile = await message.client.UserProfiles.findOne({userID: user.id});
        if (profile) {
            embed.addField(`Warnings`, profile.warnings.length, true);
            embed.addField(`Kicks`, profile.kicks.length, true);
            embed.addField(`Bans`, profile.bans.length, true);
            embed.addField(`Total Actions`, profile.totalActions, true);
        }
        const muteLog = await message.client.MuteLogs.findOne({userID: user.id, guildID: message.guild.id});
        if (muteLog) {
            embed.addField(`Muted At`, muteLog.when);
            embed.addField(`Muted Till`, new Date(parseInt(muteLog.muteTime)));
        }

        message.channel.send(embed);
    }
}