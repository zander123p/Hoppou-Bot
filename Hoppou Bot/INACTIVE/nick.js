module.exports = {
    name: 'nick',
    description: 'Change a user\'s nickname.',
    guildPermission: 'mod.nick',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to rename',
            required: true,
        },
        {
            name: 'name',
            type: 'STRING',
            description: 'The new name to give',
            required: true,
        },
    ],
    async execute(interaction) {
        const gUser = interaction.guild.members.cache.get(interaction.options.get('user').value);
        const newName = interaction.options.get('name').value;

        await gUser.setNickname(newName);
        interaction.deferUpdate();
    },
};