module.exports = {
    name: 'setlog',
    description: 'Setup a log channel with desired logs.',
    guildOnly: true,
    permissions: ['ADMINISTRATION'],
    guildPermission: 'admin.setlog',
    args: 2,
    usage: '<log channel name> <log id>..\np!setlog #log-channel 1 2 3',
    async execute(message, args) {
        const c = args[0].match(/^<#!?(\d+)>$/)[1]; // Match for #channel-name
        const logs = args.slice(1).map(x => +x); // Anything else
        const channel = message.guild.channels.cache.get(c); // Channel
        
        if (!channel)
            return message.reply(`please mention the channel you wish to use.`);

        const guild = await message.guild.ensure();
        let chnl = {};

        chnl = guild.settings.channels.find(chnls => {
            if (chnls.name === channel.name) {
                return chnls;
            }
        });

        if (!chnl) {
            chnl = {};
            chnl.name = channel.name;
            chnl.logs = logs;
            guild.settings.channels.push(chnl);
        } else {
            let logAdd = logs.map(x => { if (chnl.logs.includes(x)) return null; else return x; });
            logAdd = logAdd.filter(x => { return x != null });
            chnl.logs = chnl.logs.concat(logAdd);
            pos = guild.settings.channels.map(e => { return e.name; }).indexOf(chnl.name);
            guild.settings.channels[pos] = chnl;
        }

        await guild.save();

        pos = guild.settings.channels.map(e => { return e.name; }).indexOf(chnl.name);
        message.channel.send(`Added channel: '${channel}' for log id(s): '${guild.settings.channels[pos].logs.map(x=>x.toString()+' ')}'.`);
    }
}