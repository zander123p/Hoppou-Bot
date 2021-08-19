module.exports = {
    name: 'addrank',
    description: 'Adds a rank for the rankup module.',
    guildOnly: true,
    guildPermission: 'admin.addRank',
    args: 2,
    usage: '<role id> <required level>',
    async execute(message, args) {
        const role = args[0].match(/^<@&?(\d+)>$/)[1];
        let level = args[1];

        const g = await message.guild.ensure();

        if (!role) {
            message.reply('invalid role.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        if (!(typeof (+level) === 'number')) {
            message.reply('please specify a number for the required level.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        if (g.settings.ranks.find(r => r.id === role)) {
            message.reply('this rank is already setup.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        level = +level;
        g.settings.ranks.push({ id: role, level });

        await g.save();

        message.react('✅');
    },
};