module.exports = {
    name: 'warn',
    description: 'Warns the user provided.',
    guildOnly: true,
    guildPermission: 'mod.warn',
    args: 2,
    usage: '<user> <reason>',
    async execute(message, args) {
        const target = await message.getUserFromID(args[0]);
        const guildTarget = message.guild.members.cache.find(u => target.id === u.id);
        const reason = args.slice(1).join(' ');
        const userProfile = await guildTarget.user.ensure();
        const mg = require('mongoose');
        const newActionId = mg.Types.ObjectId();
        const log = new message.client.ActionLogs({
            _id: newActionId,
            userID: guildTarget.id,
            guildID: guildTarget.guild.id,
            type: 'warning',
            moderator: message.author.id,
            reason: reason
        });
        await log.save();
        userProfile.warnings.push(newActionId);
        userProfile.totalActions += 1;
        await userProfile.save();
        if (!target.bot)
            target.send(`You have been warned by ${message.author} for ${reason}!`);
        message.channel.send(`${target} was warned for \'${reason}\'`);
    },
};