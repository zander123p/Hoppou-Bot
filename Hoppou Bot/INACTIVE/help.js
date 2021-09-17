module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name] | [category name]',
    async execute(message, args) {
        const ListedEmbed = require('../utils/listedembed');
        const { commands } = message.client;
        let g;
        if (!message.guild) return;
        
        g = await message.guild.ensure();
        
        const permGroups = await message.guild.members.cache.get(message.author.id).getGuildPermissionGroups();

        if (!args.length) {
            const embed = new ListedEmbed()
                .setColor('#9a3deb')
                .setTitle(`Help - Catagories`);
            
            message.client.commands.categories.forEach(category => {
                
                embed.addField(category, `${g.settings.prefix}help ${category}`);
            });

            return embed.send(message.channel, 10);
        }
        const name = args[0].toLowerCase();

        const category = commands.categories.find(c => {
            if (c.toLowerCase() === name)
                return c;
        });

        if (category) {
            const embed = new ListedEmbed()
                .setColor('#9a3deb')
                .setTitle(`Commands - ${FirstUpperCase(category)}`);

            commands.forEach(command => {
                if (command.category === category) {
                    embed.addField(FirstUpperCase(command.name), command.description, true);
                }
            });

            return embed.send(message.channel, 9);
        }

        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        const embed = new ListedEmbed()
        .setColor('#9a3deb')
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

        embed.send(message.channel);
    },
};

function FirstUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}