module.exports = {
    name: 'echo',
    description: 'Replies with the given input',
    options: [
        {
            name: 'input',
            type: 'STRING',
            description: 'The input which should be echoed back',
            required: true,
        },
    ],
    execute(interaction) {
        const { value: msg } = interaction.options.get('input');
        interaction.reply({ content: msg, ephemeral: true });
    },
};