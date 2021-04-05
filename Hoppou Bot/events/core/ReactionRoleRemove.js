module.exports = {
    eventType: 'messageReactionRemove',
    async event(client, messageReaction, user) {
        const g = await messageReaction.message.guild.ensure();
        const messageID = messageReaction.message.id;
        const guild = messageReaction.message.guild;
        const emojiID = messageReaction.emoji.id;
        const messages = g.reactionMessages;

        if (user.bot) return;

        const msg = messages.find(m => m.messageID === messageID);
        if (!msg) {
            return;
        }

        const roleObj = msg.roles.find(r => r.emojiID === emojiID);
        if (!roleObj) {
            return;
        }


        const roleID = roleObj.roleID;
        const role = guild.roles.cache.get(roleID);
        const gUser = guild.members.cache.get(user.id);

        if (gUser.roles.cache.find(r => r.id === roleID)) {
            gUser.roles.remove(role);
        }
    }
};