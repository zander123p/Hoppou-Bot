module.exports = async client => {
    // Calls when the bot logs in
    console.log(`Logged in as ${client.user.tag}!`);

    const activityList = 
    [{type: 'PLAYING', msg: 'with the laws of reality'},
    {type: 'WATCHING', msg: 'the souls eagerly'},
    {type: 'PLAYING', msg: 'with some random souls'},
    {type: 'LISTENING', msg: 'to the sounds of poi'}]

    const activity = activityList[Math.floor(Math.random() * activityList.length)]
    client.user.setActivity(activity.msg, { type: activity.type });

    setInterval(() => {
        const activity = activityList[Math.floor(Math.random() * activityList.length)]
        client.user.setActivity(activity.msg, { type: activity.type });
    }, 1000 * 60 * Math.floor(Math.random() * 61) + 15)

    const usersLogs = await client.MuteLogs.find({});

    if (!usersLogs) return;

    usersLogs.forEach(log => {
        setTimeout(async () => {
            const guild = client.guilds.cache.get(log.guildID);

            const g = await guild.ensure();
            const gUser = guild.members.cache.get(log.userID);
            gUser.roles.remove(guild.roles.cache.get(g.settings.muteRole));
            await client.MuteLogs.findOneAndDelete({ userID: gUser.id, guildID: gUser.guild.id});
        }, log.muteTime - Date.now().valueOf());
    });
};