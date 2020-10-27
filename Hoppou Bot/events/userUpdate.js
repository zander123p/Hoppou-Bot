module.exports = async (client, oldUser, newUser) => {
    const guild = await oldUser.guild.ensure();
    const channelName = guild.settings.channels.find(c => { if(c.logs.includes(module.exports.id)) return c; }).name;
    const channel = oldUser.guild.channels.cache.find(c => c.name === channelName);
    channel.send(`${oldUser} has Updated their details`);
};