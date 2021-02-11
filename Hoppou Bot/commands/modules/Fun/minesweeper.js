module.exports = {
    name: 'minesweeper',
    description: 'Play a game of minesweeper.\nMax size of 9.\nDifficulties: easy, medium and hard.',
    guildOnly: true,
    usage: '[size]',
    aliases: ['ms'],
    async execute(message, args) {
        let size = Math.abs(parseInt(args[0]));
        if (!size)
            size = 9;
        if (size > 9)
            size = 9;
        if (size < 4)
            size = 4;

        let difficulty = 1;
        
        if (!parseInt(args[0]) || args[1]) {
            const diffA = args[0].toLowerCase();
            const diffB = args[0].toLowerCase();

            if (diffA) {
                switch (diffA) {
                    case 'easy':
                        difficulty = 1;
                        break;
                    case 'medium':
                        difficulty = 3;
                        break;
                    case 'hard':
                        difficulty = 5;
                        break;
                }
            }
            if (diffB) {
                switch (diffA) {
                    case 'easy':
                        difficulty = 1;
                        break;
                    case 'medium':
                        difficulty = 3;
                        break;
                    case 'hard':
                        difficulty = 4;
                        break;
                }
            }
        }
        
        let grid = '';

        let field = [];
        let bombs = Math.floor(Math.random() * size*.7) + Math.floor(size*.4) * difficulty;

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
                let f = field.find(b => b.x === j && b.y === i);
                if (f) {
                    if (f.type !== undefined)
                        grid += `||🟥||`;
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
                    grid += `||🟦||`;
                }
            }
            grid += '\n';
        }

        await message.channel.send(grid).then(message.channel.send(`${bombs} bombs!`));
    }
}

function getAround(field, x, y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let f = field.find(v => v.x === x + j && v.y === y + i);
            if (!f) {
                field.push({ x: x + j, y: y + i, value: 1 });
                continue;
            }
            if (f.type === 'bomb') continue;
            f.value = f.value + 1;
        }
    }
}