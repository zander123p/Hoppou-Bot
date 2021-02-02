module.exports = {
    name: 'removereactionrole',
    description: 'Removes a reaction role message (this will remove all applied roles on the message).',
    guildOnly: true,
    guildPermission: 'admin.removereactrole',
    args: 1,
    usage: '<message id>',
    aliases: ['removereactrole', 'removereactionmessage', 'removereactmessage'],
    async execute(message, args) {
        const messageID = args[0];
        const g = await message.guild.ensure();

        const messages = g.reactionMessages;

        msg = messages.find(m => m.messageID === messageID);

        if (msg) {
            messages.splice(messages.indexOf(msg), 1);
        } else {
            message.reply('please use a valid reaction role message.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        await g.save();

        message.guild.channels.cache.forEach(async c => {
            if (!c.type === 'text') return;
            try {
                await c.messages.fetch(messageID).then(async m => {
                    m.reactions.cache.forEach(async r => {
                        await r.users.remove(message.client.user.id);
                        message.react('✅');
                    });
                });
            } catch {
                return;
            }
        });
    }
}