module.exports = {
    name: 'setnewcommerchannel',
    description: 'Sets the channel to be used for when people join that need to be accepted in to the server.',
    guildOnly: true,
    guildPermission: 'admin.setnewcommerchannel',
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

        g.settings.newcommerChannel = channel.id;
        await g.save();

        message.react('✅');
    }
}