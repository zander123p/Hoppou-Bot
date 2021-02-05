module.exports = {
    name: 'addvctracker',
    description: 'Adds a Voice Channel to be tracked.',
    guildOnly: true,
    guildPermission: 'admin.addvctracker',
    args: 1,
    usage: '<channel>',
    async execute(message, args) {
        const c = args[0]; // Match for #channel-name
        const channel = message.guild.channels.cache.get(c);

        if (!channel) {
            message.reply('please input a valid channel').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        if (channel.type !== 'voice') {
            message.reply('please input a voice channel').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const g = await message.guild.ensure();
        if (!g.settings.VCTrackerChannels)
            g.settings.VCTrackerChannels = [];

        if (g.settings.VCTrackerChannels.includes(channel.id)) {
            message.reply('this channel is already being tracked').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        g.settings.VCTrackerChannels.push(channel.id);

        await g.save();

        message.react('✅');
    }
}