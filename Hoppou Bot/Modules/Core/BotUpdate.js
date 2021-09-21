module.exports = {
    eventType: 'botUpdate',
    async event(client) {
        console.log(`[Bot Update] Version: ${await client.getVersion()}`);
        client.guilds.cache.forEach(async guild => {
            const g = await guild.ensure();
            if (g.settings) {
                const settings = g.settings;

                if (settings.muteRole) {
                    await guild.setModuleSetting('Core', 'mute_role', settings.muteRole);
                }
                if (settings.newcommerChannel) {
                    await guild.setModuleSetting('UserVerification', 'newcomer_channel', settings.newcommerChannel);
                }
                if (settings.newcommerRole) {
                    await guild.setModuleSetting('UserVerification', 'newcomer_role', settings.newcommerRole);
                    await guild.setModuleSetting('Welcome', 'welcome_role', settings.newcommerRole);
                }
                if (settings.welcomeChannel) {
                    await guild.setModuleSetting('Welcome', 'welcome_channel', settings.welcomeChannel);
                }
                if (settings.welcomeMessage) {
                    let message = settings.welcomeMessage;
                    message = message.replace('<@user>', '{{user}}');
                    message = message.replace('<@server>', '{{server}}');
                    message = message.replace('<@count>', '{{count}}');
                    message = message.replaceAll('\n', '{{line}}');
                    await guild.setModuleSetting('Welcome', 'welcome_message', message);
                }
                if (settings.rejectChannel) {
                    await guild.setModuleSetting('UserVerification', 'reject_channel', settings.rejectChannel);
                }
                if (settings.rejectRole) {
                    await guild.setModuleSetting('UserVerification', 'reject_role', settings.rejectRole);
                }
                if (settings.rankupChannel) {
                    await guild.setModuleSetting('LevelRanks', 'levelup_channel', settings.rankupChannel);
                }
                if (settings.levelMul) {
                    await guild.setModuleSetting('LevelRanks', 'experience_multiplier', settings.levelMul);
                }
                if (settings.ranks) {
                    await guild.setModuleSetting('LevelRanks', 'ranks', settings.ranks);
                }
                if (settings.channels) {
                    await guild.setModuleSetting('Logs', 'logs', settings.channels);
                }
            }
        });
    },
};