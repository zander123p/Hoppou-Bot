module.exports = {
    name: 'setrankupchannel',
    description: 'Set the channel to use when ranking/leveling up.',
    guildOnly: true,
    guildPermission: 'admin.setrankupchannel',
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

        g.settings.rankupChannel = channel.id;
        await g.save();

        message.react('✅');
    }
}