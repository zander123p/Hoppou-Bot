module.exports = {
    name: 'permissions',
    description: 'Main permission command',
    options: [
        {
            name: 'edit',
            description: 'Edit the permissions of a group',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'name',
                    description: 'The name of the permission group',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'type',
                    description: 'The type of permissions to edit',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'Permissions',
                            value: 'permissions',
                        },
                        {
                            name: 'Blacklist',
                            value: 'blacklist',
                        },
                    ],
                },
            ],
        },
        {
            name: 'group',
            description: 'Add, remove or edit permission groups',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'add',
                    description: 'Add a permission group',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'The name of the permission group',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove a permission group',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'The name of the permission group',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'rename',
                    description: 'Rename a permission group',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'The name of the permission group',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'new-name',
                            description: 'The new name for the permission group',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'role',
                    description: 'Bind a permission group to a role',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'The name of the permission group',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'role',
                            description: 'The role to bind the permission group to',
                            type: 'ROLE',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'list',
                    description: 'List all permission groups; click a group for more info',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'type',
                            description: 'The type of permissions to be listed',
                            type: 'STRING',
                            required: true,
                            choices: [
                                {
                                    name: 'Permissions',
                                    value: 'lg_perms',
                                },
                                {
                                    name: 'Blacklist',
                                    value: 'lg_bl',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    permission: 'admin.permissions',
    async execute(interaction) {
        if (interaction.options.getSubcommandGroup(false) === 'group') {
            switch (interaction.options.getSubcommand()) {
                case 'add':
                    AddGroup(interaction);
                    break;
                case 'remove':
                    RemoveGroup(interaction);
                    break;
                case 'rename':
                    RenameGroup(interaction);
                    break;
                case 'role':
                    BindRole(interaction);
                    break;
                case 'list':
                    ListGroups(interaction);
                    break;
            }
        } else if (interaction.options.getSubcommand() === 'edit') {
            EditPermsission(interaction);
        }
    },
};

async function AddGroup(interaction) {
    // Group name
    const name = interaction.options.getString('name');

    const guild = await interaction.member.guild.ensure();

    let groupExists = false;
    guild.permissionGroups.forEach(g => {
        if (g.name === name) {
            groupExists = true;
        }
    });

    if (groupExists) return interaction.reply({ content: `The group '${name}' already exists...`, ephemeral: true });

    guild.permissionGroups.push({ name, permissions: [] });
    await guild.save();

    interaction.reply({ content: `Created group, ${name}!`, ephemeral: true });
}

async function RemoveGroup(interaction) {
    const name = interaction.options.getString('name');

    const guild = await interaction.member.guild.ensure();

    let groupExists = false;
    guild.permissionGroups.forEach(g => {
        if (g.name === name) {
            groupExists = true;
        }
    });

    if (!groupExists) return interaction.reply({ content: `The group '${name}' does not exist...`, ephemeral: true });

    guild.permissionGroups.forEach(group => {
        if (group.name === name) {
            guild.permissionGroups.splice(guild.permissionGroups.indexOf(group), 1);
        }
    });
    await guild.save();

    interaction.reply({ content: `Removed group, ${name}!`, ephemeral: true });
}

async function RenameGroup(interaction) {
    return interaction.reply({ content: 'NYI', ephemeral: true });
}

async function BindRole(interaction) {
        const role = interaction.options.getRole('role');
        const name = interaction.options.getString('name');

        const g = await interaction.member.guild.ensure();
        const group = g.permissionGroups.find(G => G.name === name);
        if (!group) {
            return interaction.reply({ content: 'Please enter a valid group.', ephemeral: true });
        }

        g.permissionGroups[g.permissionGroups.indexOf(group)].role = role.id;
        await g.save();
        interaction.reply({ content: `Bound ${name} to ${role.name}!`, ephemeral: true });
}

async function ListGroups(interaction) {
    const ListedMenu = require('../../../../utils/listedmenu');
    const g = await interaction.member.guild.ensure();
    const type = interaction.options.getString('type');
    const groups = g.permissionGroups;

    if (groups.length === 0) {
        return interaction.reply({ content: 'No valid permission groups found.', ephemeral: true });
    }

    const menu = new ListedMenu(async (i) => { listGroupCallback(i, type); })
        .setCustomId('lg_menu')
        .setPlaceholder('Select a group...');

    groups.forEach(group => {
        const name = group.name[0].toUpperCase() + group.name.substring(1);
        menu.addOption(name, group.name);
    });

    // embed.send(message.channel, 10);
    menu.send(interaction);
}

async function EditPermsission(interaction) {
    const ListedMenu = require('../../../../utils/listedmenu');
    const name = interaction.options.getString('name');
    const type = interaction.options.getString('type');

    const guild = await interaction.member.guild.ensure();

    let groupExists = false;
    guild.permissionGroups.forEach(g => {
        if (g.name === name) {
            groupExists = true;
        }
    });

    if (!groupExists) return interaction.reply({ content: `The group '${name}' does not exist...`, ephemeral: true });

    const menu = new ListedMenu((i) => { editPermsissionsCallback(i, name, type); })
        .setCustomId('ep_menu')
        .setTitle((type === 'permissions') ? `Editing permissions for group: '${name}'` : `Editing blacklist for group: '${name}'`)
        .setMaxValues(interaction.client.permissions.length);

    interaction.client.permissions.forEach(p => {
        let group;
        if (type === 'permissions')
            group = guild.permissionGroups.find(g => g.name === name).permissions;
        else if (type === 'blacklist')
            group = guild.permissionGroups.find(g => g.name === name).blacklist;
        if (group.includes(p))
            menu.addOption(p, p, '', { name: '🟢' });
        else
            menu.addOption(p, p, '', { name: '🔴' });
    });

    menu.send(interaction);
}

async function editPermsissionsCallback(i, name, type) {
    const guild = await i.member.guild.ensure();
    const perms = i.values;

    let permGroup;
    if (type === 'permissions')
        permGroup = guild.permissionGroups.find(g => { if (g.name === name) return g; }).permissions;
    else if (type === 'blacklist')
        permGroup = guild.permissionGroups.find(g => { if (g.name === name) return g; }).blacklist;
    const permsAdd = [];
    const permsRemove = [];

    let filterList = perms.filter((p) => permGroup.indexOf(p) > 0);
    filterList.forEach(p => {
        permsRemove.push(p);
    });

    filterList = perms.filter((p) => permGroup.indexOf(p) < 0);
    filterList.forEach(p => {
        permsAdd.push(p);
    });

    permsAdd.forEach(p => {
        permGroup.push(p);
    });

    permsRemove.forEach(p => {
        permGroup.splice(permGroup.indexOf(p), 1);
    });

    await guild.save();

    const ListedMenu = require('../../../../utils/listedmenu');

    const menu = new ListedMenu((inte) => { editPermsissionsCallback(inte); })
        .setCustomId('ep_menu')
        .setTitle((type === 'permissions') ? `Editing permissions for group: '${name}'` : `Editing blacklist for group: '${name}'`)
        .setMaxValues(i.client.permissions.length);

    i.client.permissions.forEach(p => {
        let group;
        if (type === 'permissions')
            group = guild.permissionGroups.find(g => g.name === name).permissions;
        else if (type === 'blacklist')
            group = guild.permissionGroups.find(g => g.name === name).blacklist;
        if (group.includes(p))
            menu.addOption(p, p, '', { name: '🟢' });
        else
            menu.addOption(p, p, '', { name: '🔴' });
    });

    menu.ApplyChanges(i);
}

async function listGroupCallback(i, alt) {
    if (i.customId === 'lg_menu') {
        const ListedEmbed = require('../../../../utils/listedembed');

        const name = i.values[0];
        const guild = await i.member.guild.ensure();

        let group;
        guild.permissionGroups.forEach(g => {
            if (g.name === name) {
                group = g;
            }
        });

        if (alt) {
            if (alt === 'lg_perms') {
                if (group.permissions.length === 0) {
                    return i.reply({ content: 'This group does not have any permissions.', ephemeral: true });
                }

                const embed = new ListedEmbed()
                    .setColor('#9a3deb')
                    .setTitle(`${group.name[0].toUpperCase() + group.name.substring(1)} - Permissions`);

                group.permissions.forEach(perm => {
                    embed.addField(perm, '⠀');
                });

                embed.send(i, 5);
                return;
            } else if (alt === 'lg_bl') {
                if (group.blacklist.length === 0) {
                    return i.reply({ content: 'This group does not have any blacklists.', ephemeral: true });
                }
                const embed = new ListedEmbed()
                    .setColor('#9a3deb')
                    .setTitle(`${group.name[0].toUpperCase() + group.name.substring(1)} - Blacklist`);

                group.blacklist.forEach(perm => {
                    embed.addField(perm, '⠀');
                });

                embed.send(i, 5);
                return;
            }
        }

        const embed = new ListedEmbed()
            .setColor('#9a3deb')
            .setTitle(group.name[0].toUpperCase() + group.name.substring(1));

        embed.addField('Role', i.member.guild.roles.cache.get(group.role), true);

        embed.send(i, 10);
    } else {
        i.deferUpdate();
    }
}