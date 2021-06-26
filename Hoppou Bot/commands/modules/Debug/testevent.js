module.exports = {
    name: 'testevent',
    description: 'Debug Command to be used for testing events on live or test builds of Hoppou Bot.',
    guildOnly: true,
    args: 2,
    usage: '<event> <params>...',
    async execute(message, args) {
        if (!message.author.id === '99604105298731008') {
            return message.react('❌');
        }

        const eventName = args[1];
        const params = args.slice(1);

        message.client.emit(eventName, params);
    }
}