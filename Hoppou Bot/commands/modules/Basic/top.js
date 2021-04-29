module.exports = {
    name: 'top',
    description: 'Get the top 10 of a category.',
    guildOnly: true,
    usage: '[messages | vc] [all]',
    aliases: ['leaderboard'],
    async execute(message, args) {
        const ListedEmbed = require('../../../utils/listedembed');
        const members = await message.client.GuildUsers.find({guildID: message.guild.id});

        if (members.length === 0) {
            message.reply('no valid users found').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        if (args.length === 0 || args[0].toLowerCase() === 'all' || args[0].toLowerCase() === 'messages') {
            const sortUsers = await message.client.GuildUsers.find({guildID: message.guild.id}).sort({messages: -1});

            const embed = new ListedEmbed()
                .setColor('#9a3deb')
                .setTitle('Top Message Senders');

            let displayCount = (sortUsers.length < 3 || ((args[1])? args[1].toLowerCase() : '') === 'all' || ((args[0])? args[0].toLowerCase() : '') === 'all')? sortUsers.length : 3;

            for (let i = 0; i < displayCount; i++) {
                const member = message.guild.members.cache.get(sortUsers[i].userID);
                embed.addField(`${member.user.tag}`, `Rank: #${i+1}\nMessages: ${sortUsers[i].messages}`);
            }

            embed.send(message.channel, 10);
        } else if (args[0].toLowerCase() === 'vc') {
            const users = await message.client.GuildUsers.find({guildID: message.guild.id});

            let sortUsers = [];
            users.forEach(user => {
                if (user.VCTracker === undefined) return;
                if (user.VCTracker.length === 0) return;
                sortUsers.push(user);
            });
            sortUsers = sortUsers.sort((a, b) => {
                let aCount = 0;
                a.VCTracker.forEach(v => aCount += v.mins);
                let bCount = 0;
                b.VCTracker.forEach(v => bCount += v.mins);

                return bCount - aCount;
            });

            const embed = new ListedEmbed()
                .setColor('#9a3deb')
                .setTitle('Top Voice Channel Spenders');

            let displayCount = (sortUsers.length < 10)? sortUsers.length : 10;

            for (let i = 0; i < displayCount; i++) {
                const member = message.guild.members.cache.get(sortUsers[i].userID);
                embed.addField(`${member.user.tag}`, (`Rank: #${i+1}\n${
                    (sortUsers[i].VCTracker.length === 1)? `${
                        message.guild.channels.cache.get(sortUsers.VCTracker[0].id).name
                    }: ${sortUsers[i].VCTracker[0].mins} Minutes` : sortUsers[i].VCTracker.map((VCT, j) => {
                        const vc = message.guild.channels.cache.get(VCT.id);

                        return (`${vc.name}: ${VCT.mins} Minutes${(sortUsers[i].VCTracker.length !== j+1)? '\n' : ''}`)
                })}`).replace(/,/g, ''));
            }

            embed.send(message.channel, 1);
        }
    }
}