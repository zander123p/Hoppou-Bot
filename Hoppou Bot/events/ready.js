module.exports = async client => {
    // Calls when the bot logs in
    console.log(`Logged in as ${client.user.tag}!`);

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