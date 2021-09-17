module.exports = {
    name: 'reactionroles',
    description: 'Main reaction roles command',
    options: [
        {
            name: 'add',
            description: 'Add a reaction role',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'message',
                    description: 'The message to tie the role to',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'role',
                    description: 'The role to give',
                    type: 'ROLE',
                    required: true,
                },
                {
                    name: 'emoji',
                    description: 'The emoji to use',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'remove',
            description: 'Remove all reaction roles from a message',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'message',
                    description: 'The message to remove from',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
    ],
    guildOnly: true,
    permission: 'admin.reactionroles',
    // args: 3,
    // usage: '<message id> <role id> <emoji>',
    // aliases: ['addreactrole', 'addreactionmessage', 'addreactmessage'],
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            const messageID = interaction.options.getString('message');
            const roleID = interaction.options.getRole('role').id;
            const emoji = interaction.options.getString('emoji');
            const guild = interaction.member.guild;

            const unicode = /\p{Extended_Pictographic}/u.test(emoji);
            if (unicode) {
                const g = await guild.ensure();

                const messages = g.reactionMessages;

                const msg = messages.find(m => m.messageID === messageID);

                if (msg) {
                    msg.roles.push({ roleID: roleID, emojiID: emoji });
                } else {
                    messages.push({ messageID: messageID, roles: [{ roleID: roleID, emojiID: emoji }] });
                }

                await g.save();

                guild.channels.cache.forEach(async c => {
                    if (!c.type === 'text') return;
                    try {
                        await c.messages.fetch(messageID).then(m => {
                            m.react(emoji);
                            interaction.reply({ content: 'Done!', ephemeral: true });
                        });
                    } catch {
                        return;
                    }
                });
                return;
            }
            const emojiID = emoji.match(/<a?:.+:(\d+)>/)[1];
            const _emoji = guild.emojis.cache.get(emojiID);

            if (!_emoji) {
                return interaction.reply({ content: 'Please use a valid emoji', ephemeral: true });
            }

            const g = await guild.ensure();

            const messages = g.reactionMessages;

            const msg = messages.find(m => m.messageID === messageID);

            if (msg) {
                msg.roles.push({ roleID: roleID, emojiID: emojiID });
            } else {
                messages.push({ messageID: messageID, roles: [{ roleID: roleID, emojiID: emojiID }] });
            }

            await g.save();

            guild.channels.cache.forEach(async c => {
                if (!c.type === 'text') return;
                try {
                    await c.messages.fetch(messageID).then(m => {
                        m.react(emoji);
                        interaction.reply({ content: 'Done!', ephemeral: true });
                });
                } catch {
                    return;
                }
            });
        } else if (interaction.options.getSubcommand() === 'remove') {
            const messageID = interaction.options.getString('message');
            const guild = interaction.member.guild;
            const g = await guild.ensure();

            const messages = g.reactionMessages;

            const msg = messages.find(m => m.messageID === messageID);

            if (msg) {
                messages.splice(messages.indexOf(msg), 1);
            } else {
                return interaction.reply({ content: 'please use a valid reaction role message', ephemeral: true });
            }

            await g.save();

            guild.channels.cache.forEach(async c => {
                if (!c.type === 'text') return;
                try {
                    await c.messages.fetch(messageID).then(async m => {
                        m.reactions.cache.forEach(async r => {
                            await r.users.remove(interaction.client.user.id);
                            interaction.reply({ content: 'Done!', ephemeral: true });
                        });
                    });
                } catch {
                    return;
                }
            });
        }
    },
};