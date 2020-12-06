module.exports = client => {
    // Calls when the bot logs in
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(g => {
        try {
            g.channels.cache.get('785145754586710016').send('Bot Started!');
        } catch {
            return;
        }
    })
};