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
    permission: 'admin.logs',
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'set') {
            SetLogs.call(this, interaction);
        } else if (interaction.options.getSubcommand() === 'list') {
            ListLogs.call(this, interaction);
        }
    },
};

async function SetLogs(interaction) {
    const channel = interaction.options.getChannel('channel');
    const guild = interaction.member.guild;
    let channels = await guild.getModuleSetting(this.module, 'logs');

    if (!channels) {
        channels = [];
    }

    const activeLogs = [];
    channels.forEach(c => {
        c.logs.forEach(l => {
            activeLogs.push({ log: l, channel: c.id });
        });
    });

    const ListedMenu = require('../../../../utils/listedmenu');

    const thisCtx = this;

    const menu = new ListedMenu((i) => { setLogsCallback(i, channel, thisCtx); })
        .setCustomId('sl_menu')
        .setPlaceholder('Select logs to toggle...')
        .setMaxValues(25);

    interaction.client.logs.forEach(k => {
        if (activeLogs.find(x => x.log === k && x.channel === channel.id)) {
            menu.addOption(k, k, '', { name: '🟢' });
        } else {
            menu.addOption(k, k, '', { name: '🔴' });
        }
    });

    menu.send(interaction);
}

async function ListLogs(interaction) {
    const guild = interaction.member.guild;
    const channels = await guild.getModuleSetting(this.module, 'logs');

    if (!channels) return interaction.reply({ content: 'No valid log channels found', ephemeral: true });

    const ListedMenu = require('../../../../utils/listedmenu');
    const thisCtx = this;
    const menu = new ListedMenu(() => { listLogsCallback(interaction, thisCtx); });

    channels.forEach(c => {
        const channel = guild.channels.cache.get(c.id);
        menu.addOption(channel.name.toString(), c.id, '');
    });

    menu.send(interaction);
}

async function listLogsCallback(i, thisCtx) {
    const guild = i.member.guild;
    const channel = guild.channels.cache.get(i.values[0]);
    const channels = await guild.getModuleSetting(thisCtx.module, 'logs');

    const ListedEmbed = require('../../../../utils/listedembed');

    const embed = new ListedEmbed()
        .setColor('#9a3deb')
        .setTitle(`Listing Logs for, '${channel.name}'`);

    const chnnl = channels.find(c => c.id === channel.id);
    chnnl.logs.forEach(log => {
        embed.addField(UpperCase(log), '⠀');
    });
    embed.send(i, 10);
}

async function setLogsCallback(i, c, thisCtx) {
    const logs = i.values;
    let channels = await i.member.guild.getModuleSetting(thisCtx.module, 'logs');
    if (!channels) {
        channels = [];
    }
    let chnl = {};

    chnl = channels.find(chnls => {
        if (chnls.id === c.id) {
            return chnls;
        }
    });

    if (!chnl) {
        chnl = {};
        chnl.id = c.id;
        chnl.logs = logs;
        channels.push(chnl);
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
            channels.forEach(C => {
                logRemove.forEach(l => {
                    if (C.logs.includes(l)) {
                        C.logs.splice(C.logs.indexOf(l), 1);
                    }
                });
                if (C.logs.length === 0) {
                    channels.splice(channels.indexOf(C), 1);
                }
            });
        }

        chnl.logs = chnl.logs.concat(logAdd);
        const pos = channels.map(e => { return e.name; }).indexOf(chnl.name);
        channels[pos] = chnl;
    }
    await i.member.guild.setModuleSetting(thisCtx.module, 'logs', channels);

    const activeLogs = [];
    channels.forEach(C => {
        C.logs.forEach(l => {
            activeLogs.push({ log: l, channel: C.id });
        });
    });
    const ListedMenu = require('../../../../utils/listedmenu');

    const menu = new ListedMenu((inte) => { setLogsCallback(inte, c, thisCtx); })
        .setCustomId('sl_menu')
        .setPlaceholder('Select all logs to toggle...')
        .setMaxValues(25);

    i.client.logs.forEach(k => {
        if (activeLogs.find(x => x.log === k && x.channel === c.id)) {
            menu.addOption(k, k, '', { name: '🟢' });
        } else {
            menu.addOption(k, k, '', { name: '🔴' });
        }
    });

    menu.ApplyChanges(i);
    // menu.send(i);
    // i.deferUpdate();
}

function UpperCase(str) {
    const split = str.split(' ');
    split.forEach(s => {
        s[0] = s[0].toUpperCase();
    });
    return split.join(' ');
}