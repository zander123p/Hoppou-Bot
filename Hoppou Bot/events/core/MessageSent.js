module.exports = {
    eventType: 'message',
    async event(client, message) {
        if (message.author.bot) return; // Check not self or bot
        const user = await message.guild.members.cache.get(message.author.id).ensure();
        const gUser = await message.guild.members.cache.get(message.author.id);
        let prefix;
        let g;
        if (message.guild) {
            g = await message.guild.ensure();
            prefix = g.settings.prefix;
        } else {
            prefix = process.env.PREFIX;
        }

        user.messages = user.messages + 1;

        if (message.guild) {
            if (g.settings.rankupChannel) {
                if (!user.exp) user.exp = 0;

                if (client.cooldowns.get(message.author.id)) {
                    return;
                } else {
                    client.cooldowns.set(message.author.id, true);
                    setTimeout(() => {
                        client.cooldowns.delete(message.author.id);
                    }, 1000);
                }

                let oldLevel = await gUser.getLevel();
                user.exp += 1;
                await user.save();
                let newLevel = await gUser.getLevel();
                if (newLevel > oldLevel) {
                    const channel = message.guild.channels.cache.get(g.settings.rankupChannel);
                    const {
                        MessageEmbed
                    } = require("discord.js");
                    const embed = new MessageEmbed()
                        .setColor('#9a3deb')
                        .setTitle(`Level up`)
                        .setTimestamp()
                        .setThumbnail(gUser.user.displayAvatarURL({
                            size: 1024
                        }));

                    embed.addField(`Level`, newLevel);

                    channel.send(`${gUser.user}, you leveled up!`);
                    channel.send(embed);

                    client.emit('guildMemberLevelup', gUser, message.guild);
                }
            }
        }

        try {
            await user.save();
        } catch {

        }

        if (!message.content.toLowerCase().startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.reply(`the command '${commandName}' does not exsit. Please make sure you typed it correctly!\nFor a list of all commands, type \`${prefix}help\``);

        if (command.guildOnly && message.channel.type === 'dm') return message.reply('I can\'t execute that command inside DMs!');

        //if (message.guild && !message.guild.member(message.author).hasPermission(command.permissions)) return message.reply('you don\'t have the required permissions to run that command!');

        if (message.guild && !await message.guild.member(message.author).hasGuildPermission(command.guildPermission)) return message.reply('you don\'t have the required permissions to run that command!').then(msg => msg.delete({
            timeout: 5000
        }));

        if (command.args && !args.length || args.length < command.args) {
            let reply = (args.length < command.args && args.length != 0) ? `you didn't provide enough arguments!` : `you didn't provide any arguments!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.reply(reply).then(msg => msg.delete({
                timeout: 5000
            }));
        }

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error running this command!').then(msg => msg.delete({
                timeout: 5000
            }));
        }
    }
};