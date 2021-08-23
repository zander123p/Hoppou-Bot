module.exports = {
    name: 'logs',
    description: 'Main log command',
    options: [
        {
            name: 'set',
            description: 'Add and remove logs from a channel',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to add or remove logs from',
                    type: 'CHANNEL',
                    required: true,
                },
            ],
        },
        {
            name: 'list',
            description: 'List all logs',
            type: 'SUB_COMMAND',
        },
    ],
    guildOnly: true,
    guildPermission: 'admin.logs',
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'set') {
            SetLogs(interaction);
        } else if (interaction.options.getSubcommand() === 'list') {
            ListLogs(interaction);
        }
    },
};

async function SetLogs(interaction) {
    const channel = interaction.options.getChannel('channel');
    const g = await interaction.member.guild.ensure();

    const activeLogs = [];
    g.settings.channels.forEach(c => {
        c.logs.forEach(l => {
            activeLogs.push({ log: l, channel: c.name });
        });
    });

    const ListedMenu = require('../../../utils/listedmenu');

    const menu = new ListedMenu((i) => { setLogsCallback(i, channel); })
        .setCustomId('sl_menu')
        .setPlaceholder('Select logs to toggle...')
        .setMaxValues(25);

    Array.from(interaction.client.events.keys()).forEach(k => {
        if (activeLogs.find(x => x.log === interaction.client.events.get(k) && x.channel === channel.id)) {
            menu.addOption(interaction.client.events.get(k)[0].toUpperCase() + interaction.client.events.get(k).substring(1), interaction.client.events.get(k), '', { name: '🟢' });
        } else {
            menu.addOption(interaction.client.events.get(k)[0].toUpperCase() + interaction.client.events.get(k).substring(1), interaction.client.events.get(k), '', { name: '🔴' });
        }
    });

    menu.send(interaction);
}

async function ListLogs(interaction) {
    return interaction.reply({ content: 'NYI', ephemeral: true });
}

async function setLogsCallback(i, c) {
    const g = await i.member.guild.ensure();
    const logs = i.values;
    let chnl = {};

    chnl = g.settings.channels.find(chnls => {
        if (chnls.name === c.id) {
            return chnls;
        }
    });

    if (!chnl) {
        chnl = {};
        chnl.name = c.id;
        chnl.logs = logs;
        g.settings.channels.push(chnl);
    } else {
        const logAdd = [];
        const logRemove = [];
        logs.forEach(x => {
            if (chnl.logs.includes(x)) {
                logRemove.push(x);
            } else {
                logAdd.push(x);
            }
        });
        if (logRemove.length > 0) {
            g.settings.channels.forEach(C => {
                logRemove.forEach(l => {
                    if (C.logs.includes(l)) {
                        C.logs.splice(C.logs.indexOf(l), 1);
                    }
                });
                if (C.logs.length === 0) {
                    g.settings.channels.splice(g.settings.channels.indexOf(C), 1);
                }
            });
        }

        chnl.logs = chnl.logs.concat(logAdd);
        const pos = g.settings.channels.map(e => { return e.name; }).indexOf(chnl.name);
        g.settings.channels[pos] = chnl;
    }

    await g.save();

    const activeLogs = [];
    g.settings.channels.forEach(C => {
        C.logs.forEach(l => {
            activeLogs.push({ log: l, channel: C.name });
        });
    });
    const ListedMenu = require('../../../utils/listedmenu');

    const menu = new ListedMenu((inte) => { setLogsCallback(inte, c); })
        .setCustomId('sl_menu')
        .setPlaceholder('Select all logs to toggle...')
        .setMaxValues(25);

    Array.from(i.client.events.keys()).forEach(k => {
        if (activeLogs.find(x => x.log === i.client.events.get(k) && x.channel === c.id)) {
            menu.addOption(i.client.events.get(k)[0].toUpperCase() + i.client.events.get(k).substring(1), i.client.events.get(k), '', { name: '🟢' });
        } else {
            menu.addOption(i.client.events.get(k)[0].toUpperCase() + i.client.events.get(k).substring(1), i.client.events.get(k), '', { name: '🔴' });
        }
    });

    menu.ApplyChanges(i);
    // menu.send(i);
    // i.deferUpdate();
}