module.exports = {
    name: 'addvctracker',
    description: 'Adds a Voice Channel to be tracked.',
    guildOnly: true,
    guildPermission: 'admin.addvctracker',
    args: 1,
    usage: '<channel id> [user threshold]',
    async execute(message, args) {
        const c = args[0]; // Match for #channel-name
        const channel = message.guild.channels.cache.get(c);

        if (!channel) {
            message.reply('please input a valid channel').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        if (channel.type !== 'voice') {
            message.reply('please use a voice channel').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const g = await message.guild.ensure();
        if (!g.settings.VCTrackerChannels)
            g.settings.VCTrackerChannels = [];

        if (g.settings.VCTrackerChannels.find(vc => vc.id === channel.id)) {
            message.reply('this channel is already being tracked').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const threshold = parseInt(args[1]);
        if (!threshold)
            threshold = 1;

        g.settings.VCTrackerChannels.push({id: channel.id, threshold});

        await g.save();

        message.react('✅');
    }
}