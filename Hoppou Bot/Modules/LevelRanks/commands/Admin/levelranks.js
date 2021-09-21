module.exports = {
    name: 'levelranks',
    description: 'Main level ranks module command',
    options: [
        {
            name: 'channel',
            description: 'Set or clear channels for the levelup module',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'set',
                    description: 'Set the channels and what type they should be',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'channel',
                            description: 'The channel to set',
                            type: 'CHANNEL',
                            required: true,
                        },
                        {
                            name: 'type',
                            description: 'What the channel should be',
                            type: 'STRING',
                            required: true,
                            choices: [
                                {
                                    name: 'Levelup Channel',
                                    value: 'levelup_channel',
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove a set channel',
                    type: 'SUB_COMMAND',
                },
            ],
        },
        {
            name: 'role',
            description: 'Set or clear roles for the levelup module',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'set',
                    description: 'Set the role and what type it should be',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'role',
                            description: 'The role to set',
                            type: 'ROLE',
                            required: true,
                        },
                        {
                            name: 'type',
                            description: 'What type the role should be',
                            type: 'STRING',
                            required: true,
                            choices: [
                                {
                                    name: 'Required Role',
                                    value: 'levelup_role',
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove a set role',
                    type: 'SUB_COMMAND',
                },
            ],
        },
        {
            name: 'rank',
            description: 'Add or remove ranks',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'add',
                    description: 'Add a rank',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'role',
                            description: 'The role to bind the rank to',
                            type: 'ROLE',
                            required: true,
                        },
                        {
                            name: 'level',
                            description: 'The level to set the rank at',
                            type: 'INTEGER',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove a Rank',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'role',
                            description: 'The role the rank is attached to',
                            type: 'ROLE',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'list',
                    description: 'List all ranks added',
                    type: 'SUB_COMMAND',
                },
            ],
        },
        {
            name: 'experience',
            description: 'Get, set or reset the experience multiplier',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'set',
                    description: 'Set the experience multiplier',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'multiplier',
                            description: 'The new experience multiplier',
                            type: 'NUMBER',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'get',
                    description: 'Get the experience multiplier',
                    type: 'SUB_COMMAND',
                },
                {
                    name: 'reset',
                    description: 'Reset the experince multiplier',
                    type: 'SUB_COMMAND',
                },
            ],
        },
    ],
    guildOnly: true,
    permission: 'admin.levelranks',
    async execute(interaction) {
        if (interaction.options.getSubcommandGroup() === 'rank') {
            if (interaction.options.getSubcommand() === 'add') {
                const role = interaction.options.getRole('role');
                const guild = interaction.member.guild;

                let level = interaction.options.getInteger('level');
                let ranks = await guild.getModuleSetting(this.module, 'ranks');

                if (!ranks) ranks = [];

                level = Math.abs(level);

                if (ranks.find(r => r.id === role.id)) {
                    return interaction.reply({ content: 'This rank is already setup.', ephemeral: true });
                }

                ranks.push({ id: role, level });

                await guild.setModuleSetting(this.module, 'ranks', ranks);
                interaction.reply({ content: 'Done!', ephemeral: true });
            } else if (interaction.options.getSubcommand() === 'remove') {
                const role = interaction.options.getRole('role');
                const guild = interaction.member.guild;
                let ranks = await guild.getModuleSetting(this.module, 'ranks');

                if (!ranks) ranks = [];

                if (!ranks.find(r => r.id === role.id)) {
                    return interaction.reply({ content: 'This rank doesn\'t exist.', ephemeral: true });
                }

                const rank = ranks.find(r => r.id === role);

                ranks.splice(ranks.indexOf(rank), 1);
                await interaction.options.setModuleSetting(this.module, 'ranks', ranks);
                interaction.reply({ content: 'Done!', ephemeral: true });
            } else if (interaction.options.getSubcommand() === 'list') {
                const ListedEmbed = require('../../../../utils/listedembed');
                const guild = interaction.member.guild;
                const ranks = await guild.getModuleSetting(this.module, 'ranks');

                const embed = new ListedEmbed()
                    .setColor('#9a3deb')
                    .setTitle('Level Ranks');

                ranks.forEach(rank => {
                    const role = guild.roles.cache.get(rank.id);
                    const level = rank.level;

                    embed.addField(role.name, `Level: ${level}`, true);
                });
                embed.send(interaction);
            }
        } else if (interaction.options.getSubcommandGroup() === 'experience') {
            if (interaction.options.getSubcommand() === 'set') {
                const xpMul = interaction.options.getNumber('multiplier');
                const guild = interaction.member.guild;

                await guild.setModuleSetting(this.module, 'experience_multiplier', xpMul);
                interaction.reply({ content: 'Done!', ephemeral: true });
            } else if (interaction.options.getSubcommand() === 'get') {
                const guild = interaction.member.guild;
                const xpMul = await guild.getModuleSetting(this.module, 'experience_multiplier');

                interaction.reply({ content: `Current Experience Multiplier: ${(xpMul) ? xpMul : 1}`, ephemeral: true });
            } else if (interaction.options.getSubcommand() === 'reset') {
                const guild = interaction.member.guild;

                await guild.setModuleSetting(this.module, 'experience_multiplier', 1);
                interaction.reply({ content: 'Done!', ephemeral: true });
            }
        } else if (interaction.options.getSubcommandGroup() === 'channel') {
            if (interaction.options.getSubcommand() === 'set') {
                const channel = interaction.options.getChannel('channel');
                const type = interaction.options.getString('type');
                const guild = interaction.member.guild;

                if (type === 'levelup_channel') {
                    await guild.setModuleSetting(this.module, 'levelup_channel', channel.id);
                }

                interaction.reply({ content: 'Done!', ephemeral: true });
            } else if (interaction.options.getSubcommand() === 'remove') {
                const ListedMenu = require('../../../../utils/listedmenu');
                const guild = interaction.member.guild;
                const thisCtx = this;

                const menu = new ListedMenu((i) => { RemoveCallback(i, thisCtx); })
                    .setPlaceholder('Select channel to remove...')
                    .setCustomId('lr-remove-channel');

                const levelupChannel = await guild.getModuleSetting(this.module, 'levelup_channel');
                if (levelupChannel)
                    menu.addOption('Levelup Channel', 'levelup_channel', levelupChannel.name);

                if (menu.optionCount === 0)
                    return interaction.reply({ content: 'No channels added', ephemeral: true });
                else
                    return menu.send(interaction);
            }
        } else if (interaction.options.getSubcommandGroup() === 'role') {
            if (interaction.options.getSubcommand() === 'set') {
                const role = interaction.options.getRole('role');
                const type = interaction.options.getString('type');
                const guild = interaction.member.guild;

                if (type === 'levelup_role') {
                    await guild.setModuleSetting(this.module, 'levelup_role', role.id);
                }

                interaction.reply({ content: 'Done!', ephemeral: true });
            } else if (interaction.options.getSubcommand() === 'remove') {
                const ListedMenu = require('../../../../utils/listedmenu');
                const guild = interaction.member.guild;
                const thisCtx = this;

                const menu = new ListedMenu((i) => { RemoveCallback(i, thisCtx); })
                    .setPlaceholder('Select role to remove...')
                    .setCustomId('lr-remove-role');

                const levelupRole = await guild.getModuleSetting(this.module, 'levelup_role');
                if (levelupRole)
                    menu.addOption('Levelup Channel', 'levelup_channel', levelupRole.name);

                if (menu.optionCount === 0)
                    return interaction.reply({ content: 'No roles added', ephemeral: true });
                else
                    return menu.send(interaction);
            }
        }
    },
};

async function RemoveCallback(i, thisCtx) {
    const id = i.customId;
    const guild = i.member.guild;

    if (id === 'lr-remove-channel') {
        const value = i.values[0];

        await guild.setModuleSetting(thisCtx.module, value, null);

        const ListedMenu = require('../../../../utils/listedmenu');

        const menu = new ListedMenu((inte) => { RemoveCallback(inte, thisCtx); })
            .setPlaceholder('Select channel to remove...')
            .setCustomId('lr-remove-channel');

        const levelupChannel = await guild.getModuleSetting(thisCtx.module, 'levelup_channel');
        if (levelupChannel)
            menu.addOption('Levelup Channel', 'levelup_channel', levelupChannel.name);

        if (menu.optionCount === 0)
            return i.reply({ content: 'No channels added', ephemeral: true });
        else
            return menu.send(i);
    } else if (id === 'lr-remove-role') {
        const value = i.values[0];

        await guild.setModuleSetting(thisCtx.module, value, null);

        const ListedMenu = require('../../../../utils/listedmenu');

        const menu = new ListedMenu((inte) => { RemoveCallback(inte, thisCtx); })
            .setPlaceholder('Select role to remove...')
            .setCustomId('lr-remove-role');

        const levelupRole = await guild.getModuleSetting(thisCtx.module, 'levelup_role');
        if (levelupRole)
            menu.addOption('Levelup Role', 'levelup_role', levelupRole.name);

        if (menu.optionCount === 0)
            return i.reply({ content: 'No roles added', ephemeral: true });
        else
            return menu.send(i);
    }
}