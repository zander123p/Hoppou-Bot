module.exports = {
    name: 'addreactionrole',
    description: 'Adds a reaction role to a message.',
    guildOnly: true,
    guildPermission: 'admin.addreactrole',
    args: 3,
    usage: '<message id> <role id> <emoji>',
    aliases: ['addreactrole', 'addreactionmessage', 'addreactmessage'],
    async execute(message, args) {
        const messageID = args[0];

        const roleID = args[1].match(/^<@&?(\d+)>$/)[1];

        if (!roleID) {
            message.reply('please use a valid role.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }
        const emojiID = args[2].match(/<a?:.+:(\d+)>/)[1];
        const emoji = message.guild.emojis.cache.get(emojiID);

        if (!emoji) {
            message.reply('please use a valid emoji.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const g = await message.guild.ensure();

        const messages = g.reactionMessages;

        msg = messages.find(m => m.messageID === messageID);

        if (msg) {
            msg.roles.push({roleID: roleID, emojiID: emojiID});
        } else {
            messages.push({messageID: messageID, roles: [{roleID: roleID, emojiID: emojiID}]});
        }

        await g.save();

        message.guild.channels.cache.forEach(async c => {
            if (!c.type === 'text') return;
            try {
                await c.messages.fetch(messageID).then(m => {
                    m.react(emoji);
                    message.react('✅');
                });
            } catch {
                return;
            }
        });
    }
}