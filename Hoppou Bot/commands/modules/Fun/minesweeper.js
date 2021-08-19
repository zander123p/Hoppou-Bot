module.exports = {
    name: 'minesweeper',
    description: 'Play a game of minesweeper.\nMax size of 9.\nDifficulties: easy, medium and hard.',
    guildOnly: true,
    options: [
        {
            name: 'size',
            description: 'The size of the field (Max size of 9)',
            type: 'INTEGER',
        },
        {
            name: 'difficulty',
            description: 'The difficulty of the game',
            type: 'STRING',
            choices: [
                {
                    name: 'Easy',
                    value: 'ms_diff_easy',
                },
                {
                    name: 'Medium',
                    value: 'ms_diff_med',
                },
                {
                    name: 'Hard',
                    value: 'ms_diff_hard',
                },
            ],
        },
    ],
    // usage: '[size] [difficulty]',
    async execute(interaction) {
        let size = (interaction.options.get('size')) ? interaction.options.get('size').value : 9;
        const diff = (interaction.options.get('difficulty')) ? interaction.options.get('difficulty').value : 'ms_diff_easy';

        if (size > 9)
            size = 9;
        if (size < 4)
            size = 4;

        let difficulty = 1;


        if (diff) {
            switch (diff) {
                case 'ms_diff_easy':
                    difficulty = 1;
                    break;
                case 'ms_diff_med':
                    difficulty = 3;
                    break;
                case 'ms_diff_hard':
                    difficulty = 5;
                    break;
            }
        }

        let grid = '';

        const field = [];
        const bombs = Math.floor(Math.random() * size * 0.7) + Math.floor(size * 0.4) * difficulty;

        for (let i = 0; i < bombs; i++) {
            let f, x, y;
            do {
                x = Math.floor(Math.random() * size);
                y = Math.floor(Math.random() * size);
                f = field.find(b => b.x === x && b.y === y);
            } while(f);
            field.push({ x, y, type: 'bomb' });
        }

        field.forEach(b => {
            if (b.type === 'bomb') {
                getAround(field, b.x, b.y);
            }
        });

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const f = field.find(b => b.x === j && b.y === i);
                if (f) {
                    if (f.type !== undefined)
                        grid += '||🟥||';
                    else {
                        switch (f.value) {
                            case 1:
                                grid += '||1️⃣||';
                                break;
                            case 2:
                                grid += '||2️⃣||';
                                break;
                            case 3:
                                grid += '||3️⃣||';
                                break;
                            case 4:
                                grid += '||4️⃣||';
                                break;
                            case 5:
                                grid += '||5️⃣||';
                                break;
                            case 6:
                                grid += '||6️⃣||';
                                break;
                            case 7:
                                grid += '||7️⃣||';
                                break;
                            case 8:
                                grid += '||8️⃣||';
                                break;
                        }
                    }
                } else {
                    grid += '||🟦||';
                }
            }
            grid += '\n';
        }

        await interaction.reply(grid);
        interaction.fetchReply().then((m) => m.channel.send(`${bombs} bombs!`));
    },
};

function getAround(field, x, y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const f = field.find(v => v.x === x + j && v.y === y + i);
            if (!f) {
                field.push({ x: x + j, y: y + i, value: 1 });
                continue;
            }
            if (f.type === 'bomb') continue;
            f.value = f.value + 1;
        }
    }
}