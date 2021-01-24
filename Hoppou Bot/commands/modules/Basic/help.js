const Discord = require('discord.js');
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    async execute(message, args) {
        const { commands } = message.client;
        let g;
        if (message.guild)
            g = await message.guild.ensure();
    
        if (!args.length) {
            let currentCategory = null;
            let currentCategoryIndex = 0;

            if (!currentCategory) {
                currentCategory = commands.categories[currentCategoryIndex];
            }

            const embed = new Discord.MessageEmbed()
                .setColor('#158559')
                .setTitle(`Commands - ${FirstUpperCase(currentCategory)}`);
            
            commands.forEach(cmd => {
                if (cmd.category !== currentCategory) return;
                embed.addField(FirstUpperCase(cmd.name), cmd.description, true);
            });

            const filter = (reaction, user) => {
                return !user.bot;
            };
            
            message.channel.send(embed).then(async msg => {
                msg.react('⬅️').then(() => msg.react('➡️'));
                let collector = msg.createReactionCollector(filter, { time: 15000 });
                collector.on('collect', async (reaction, user) => {
                    if (reaction.emoji.name === '⬅️') {
                        if (currentCategoryIndex - 1 < 0)
                            currentCategoryIndex = commands.categories.length-1;
                        else
                            currentCategoryIndex--;
                        await reaction.users.remove(user.id);
                        collector.resetTimer();
                    } else if (reaction.emoji.name === '➡️') {
                        if (currentCategoryIndex + 1 >= commands.categories.length)
                            currentCategoryIndex = 0;
                        else
                            currentCategoryIndex++;
                        await reaction.users.remove(user.id);
                        collector.resetTimer();
                    }
                    currentCategory = commands.categories[currentCategoryIndex];
    
                    embed.setTitle(`Commands - ${FirstUpperCase(currentCategory)}`);
                    embed.fields = [];
                    commands.forEach(cmd => {
                        if (cmd.category !== currentCategory) return;
                        embed.addField(FirstUpperCase(cmd.name), cmd.description, true);
                    });
        
                    msg.edit(embed);
                });

                collector.on('end', async () => {
                    const botReact = msg.reactions.cache.filter(reaction => reaction.users.cache.has(msg.author.id))
                    for (const reaction of botReact.values()) {
                        await reaction.users.remove(msg.author.id);
                    }
                });
            })
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                return;
            });

            return;
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        const embed = new Discord.MessageEmbed()
        .setColor('#158559')
        .setTitle(FirstUpperCase(command.name));

        let prefix;
        if (message.channel.type === 'dm')
            prefix = process.env.PREFIX;
        else
            prefix = g.settings.prefix;

        if (command.aliases) embed.addField('Aliases', command.aliases.join(', '));
        if (command.description) embed.addField('Description', command.description);
        if (command.usage) embed.addField('Usage', `${prefix}${command.name} ${command.usage}`);
        if (command.guildPermission) embed.addField('Required Permission', command.guildPermission);

        message.channel.send(embed);
    },
};

function FirstUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}