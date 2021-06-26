module.exports = {
    name: 'testlog',
    description: 'Debug Command to be used for testing logs on live or test builds of Hoppou Bot.',
    guildOnly: true,
    args: 1,
    usage: '<log>',
    async execute(message, args) {
        if (message.author.id !== '99604105298731008') {
            return message.react('❌');
        }

        const eventName = args[0].toLowerCase();

        switch (eventName) {
            case 'guildbanadd':
                message.client.emit('guildBanAdd', message.channel.guild, message.author.user, message.author.user);
                message.react('✅');
                break;
            case 'guildbanremove':
                message.client.emit('guildBanRemove', message.channel.guild, message.author.user, message.author.user);
                message.react('✅');
                break;
            case 'guildmemberadd':
                message.client.emit('guildMemberAdd', message.channel.guild.members.cache.get(message.author.id));
                message.react('✅');
                break;
            case 'guildmemberremove':
                message.client.emit('guildMemberRemove', message.channel.guild.members.cache.get(message.author.id));
                message.react('✅');
                break;
            case 'guildmemberkick':
                message.client.emit('guildMemberKick', message.channel.guild.members.cache.get(message.author.id), message.author.user);
                message.react('✅');
                break;
        }
    }
}