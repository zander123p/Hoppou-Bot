module.exports = {
    name: 'purge',
    description: 'Purge a set number of messages from a channel (capped at 30)',
    guildPermission: 'mod.purge',
    options: [
        {
            name: 'number',
            type: 'NUMBER',
            description: 'The amount of messages to purge',
            required: true,
        },
    ],
    async execute(interaction) {
        let number = parseInt(interaction.options.get('number').value);
        const channel = interaction.guild.channels.cache.get(interaction.channelId);

        if (number > 30)
            number = 30;

        channel.bulkDelete(number)
            .then((messages) => {
                interaction.client.emit('messageDeleteBulk', messages, interaction.user);
                interaction.deferUpdate();
            }).catch(() => {
                const content = `could not purge ${number} messages.`;
                return interaction.reply({ content, ephemeral: true });
            });
    },
};