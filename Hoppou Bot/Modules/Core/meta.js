module.exports = {
    name: 'Core',
    coreModule: true,
    events: [
        'BotReady',
        'GuildJoin',
        'GuildLeave',
        'Interaction',
        'MessageSent',
    ],
};