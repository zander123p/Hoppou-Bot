module.exports = {
    name: 'profiling',
    description: 'Debug Command to be used for profiling on live or test builds of Hoppou Bot.',
    guildOnly: true,
    args: 1,
    usage: '<?>',
    async execute(message, args) {
        if (message.author.id !== '99604105298731008') {
            return message.react('❌');
        }

    }
}