module.exports = {
    name: 'bubblewrap',
    description: 'Makes a grid of spoilers that act like bubblewrap.\nMax size of 12.',
    guildOnly: true,
    usage: '[size]',
    async execute(message, args) {
        let size = Math.abs(parseInt(args[0]));
        if (!size) {
            if (!args[0]) size = 5;
            else size = args[0].length;
        }
        if (size > 12)
            size = 12;
        
        let wrap = '';

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                wrap += `||⠀⠀||`;
            }
            wrap += '\n';
        }

        message.channel.send(wrap);
    }
}