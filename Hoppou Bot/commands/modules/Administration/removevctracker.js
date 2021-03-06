module.exports = {
    name: 'removevctracker',
    description: 'Removes a Voice Channel from being tracked.',
    guildOnly: true,
    guildPermission: 'admin.removevctracker',
    args: 1,
    usage: '<channel id>',
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

        const vc = g.settings.VCTrackerChannels.find(vc => vc.id === channel.id);

        if (!vc) {
            message.reply('this channel is not being tracked').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        g.settings.VCTrackerChannels.splice(g.settings.VCTrackerChannels.indexOf(vc), 1);

        await g.save();

        message.react('✅');
    }
}