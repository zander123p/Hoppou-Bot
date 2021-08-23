module.exports = {
    name: 'settrackerchannel',
    description: 'Sets the channel to update when tracked role members go online/offline.',
    guildOnly: true,
    guildPermission: 'admin.settrackerchannel',
    args: 1,
    usage: '<channel>',
    async execute(message, args) {
        const c = args[0].match(/^<#!?(\d+)>$/)[1]; // Match for #channel-name
        const channel = message.guild.channels.cache.get(c);

        if (!channel) {
            message.reply('please input a valid channel').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        const g = await message.guild.ensure();

        g.settings.rejectChannel = channel.id;
        await g.save();

        message.react('✅');
    }
}