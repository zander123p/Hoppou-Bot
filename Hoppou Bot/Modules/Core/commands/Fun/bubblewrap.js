module.exports = {
    name: 'bubblewrap',
    description: 'Makes a grid of spoilers that act like bubblewrap.\nMax size of 12.',
    guildOnly: true,
    options: [
        {
            name: 'size',
            description: 'The size to make it',
            type: 'INTEGER',
        },
    ],
    // usage: '[size]',
    async execute(interaction) {
        let size = (interaction.options.get('size')) ? interaction.options.get('size').value : 5;
        size = Math.abs(size);

        if (size > 12)
            size = 12;
        if (size <= 0)
            size = 1;

        let wrap = '';

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                wrap += '||⠀⠀||';
            }
            wrap += '\n';
        }

        interaction.reply(wrap);
    },
};