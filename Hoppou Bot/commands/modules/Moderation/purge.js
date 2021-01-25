module.exports = {
    name: 'purge',
    description: 'Purge a set number of messages from a channel (capped at 30)',
    guildOnly: true,
    guildPermission: 'mod.purge',
    args: 1,
    usage: '<message count>',
    aliases: ['prune'],
    async execute(message, args) {
        const number = parseInt(args[0]);

        if (!number) {
            message.reply('please enter a valid number.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        if (number > 30)
            number = 30;

        message.channel.bulkDelete(number+1)
            .then((messages) => {
                message.client.emit('messageDeleteBulk', messages, message.author);
            }).catch(() => {
                message.reply(`could not purge ${number} messages.`).then(msg => msg.delete({ timeout: 5000 }));
                return message.react('❌');
            });
    }
}