const mongoose = require("mongoose");

module.exports = {
    name: 'mute',
    description: 'Mute a user.',
    guildOnly: true,
    guildPermission: 'mod.mute',
    args: 2,
    usage: '<user> [d]/[h]/[m]',
    async execute(message, args) {
        args[1] = args[1].toLowerCase();
        const g = await message.guild.ensure();
        if (!g.settings.muteRole) {
            message.reply('a mute role needs to be assigned first!').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }        

        const user = await message.getUserFromID(args[0]);
        if (!user) {
            message.reply('please enter a valid user.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }
        const argTime = args[1];
        let muteTime;

        if (['d','h','m'].includes(argTime[argTime.length-1]) && (parseInt(argTime.replace('d', '')) || parseInt(argTime.replace('h', '') || parseInt(argTime.replace('m', ''))))) {
            switch (argTime[argTime.length-1]) {
                case 'd':
                    muteTime = 1000*60*60*24*argTime.replace('d', '');
                    break;
                case 'h':
                    muteTime = 1000*60*60*argTime.replace('h', '');
                    break;
                case 'm':
                    muteTime = 1000*60*argTime.replace('m', '');
                    break;
            }
        } else {
            message.reply('please enter a valid time.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        let date = Date.now();
        date += muteTime;
        date = new Date(date);

        const gUser = message.guild.members.cache.get(user.id);
        gUser.roles.add(message.guild.roles.cache.get(g.settings.muteRole));

        const log = new message.client.MuteLogs({
            _id: mongoose.Types.ObjectId(),
            userID: gUser.id,
            guildID: message.guild.id,
            muteTime: date.valueOf(),
        });
        await log.save();

        setTimeout(async () => {
            const g = await message.guild.ensure();
            const gUser = message.guild.members.cache.get(user.id);
            gUser.roles.remove(message.guild.roles.cache.get(g.settings.muteRole));
            await message.client.MuteLogs.findOneAndDelete({ userID: gUser.id, guildID: gUser.guild.id});
        }, muteTime);

        message.react('✅');
    }
}