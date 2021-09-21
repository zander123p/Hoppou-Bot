module.exports = {
    name: 'Core',
    coreModule: true,
    events: [
        'BotReady',
        'BotUpdate',
        'GuildJoin',
        'GuildLeave',
        'Interaction',
        'MessageSent',
    ],
};