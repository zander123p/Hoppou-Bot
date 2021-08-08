module.exports = {
    eventType: 'ready',
    async event(client) {
        // Calls when the bot logs in
        console.log(`Logged in as ${client.user.tag}!`);


        // Set Activity
        const activityList = [{
                type: 'PLAYING',
                msg: 'with the laws of reality'
            },
            {
                type: 'WATCHING',
                msg: 'souls eagerly'
            },
            {
                type: 'PLAYING',
                msg: 'with random souls'
            },
            {
                type: 'LISTENING',
                msg: 'the sounds of poi'
            },
        ]

        const activity = activityList[Math.floor(Math.random() * activityList.length)]
        client.user.setActivity(activity.msg, {
            type: activity.type
        });

        setInterval(() => {
            const activity = activityList[Math.floor(Math.random() * activityList.length)]
            client.user.setActivity(activity.msg, {
                type: activity.type
            });
        }, 1000 * 60 * Math.floor(Math.random() * 61) + 15)

        // Newcommer system update
        const newUsers = await client.GuildNewJoins.find({});

        if (newUsers) {
            newUsers.forEach(async usp => {
                const userID = usp.userID;
                const guildID = usp.guildID;
                const messageID = usp.messageID;

                const guild = client.guilds.cache.get(guildID);
                if (!guild) return;
                const user = guild.members.cache.get(userID);
                const g = await guild.ensure();
                const channel = guild.channels.cache.get(g.settings.newcommerChannel);
                try {
                    const message = await channel.messages.fetch(messageID);
                    if (!user) {
                        message.delete();
                        await client.GuildNewJoins.findOneAndDelete({ userID, guildID });
                    }
    
                    if (user.roles.cache.has(guild.roles.cache.get(g.settings.newcommerRole))) {
                        message.delete();
                        await client.GuildNewJoins.findOneAndDelete({ userID, guildID });
                    }
                } catch {
                    console.log(`Invalid message in database\nMessageID: ${messageID}\nUserID: ${userID}\nGuildID: ${guildID}`);
                }
            });
        }

        // Mute log update
        const usersLogs = await client.MuteLogs.find({});

        if (usersLogs) {
            usersLogs.forEach(log => {
                setTimeout(async () => {
                    const guild = client.guilds.cache.get(log.guildID);
    
                    const g = await guild.ensure();
                    const gUser = guild.members.cache.get(log.userID);
                    gUser.roles.remove(guild.roles.cache.get(g.settings.muteRole));
                    await client.MuteLogs.findOneAndDelete({
                        userID: gUser.id,
                        guildID: gUser.guild.id
                    });
                }, log.muteTime - Date.now().valueOf());
            });
        }



        //Month check
        if (isLastDay(new Date())) {
            client.guilds.cache.forEach(async guild => {
                const members = await client.GuildUsers.find({
                    guildID: guild.id
                });
                members.forEach(async member => {
                    if (member.VCTracker) {
                        member.VCTracker = undefined;
                        await member.save();
                    }
                });
            });
        }

        //Check users in VCs
        client.guilds.cache.forEach(async guild => {
            const g = await guild.ensure();
            g.settings.VCTrackerChannels.forEach(async c => {
                const vc = guild.channels.cache.get(c.id);

                vc.members.forEach(async member => {
                    const vState = member.voice;
                    if (!vState.channel) return;

                    if (member.user.bot) return;

                    if (client.VCTracker.get(member.id)) {
                        clearInterval(client.VCTracker.get(member.id));
                        client.VCTracker.delete(member.id);
                    }
                    let tracker = setInterval(async () => {
                        if (vc.members.size < c.threshold) return;

                        const user = await member.ensure();
                        let t = user.VCTracker.find(tracker => tracker.id === vState.channel.id);
                        if (t) {
                            user.VCTracker[user.VCTracker.indexOf(t)].mins = user.VCTracker[user.VCTracker.indexOf(t)].mins + 1;
                            await user.save();
                        } else {
                            user.VCTracker.push({
                                id: vState.channel.id,
                                mins: 1
                            });
                            await user.save();
                        }
                    }, 60000);
                    client.VCTracker.set(member.id, tracker);
                });
            });
        });
    }
};


// https://stackoverflow.com/questions/6355063/how-to-validate-date-if-is-the-last-day-of-the-month-with-javascript
function isLastDay(dt) {
    return new Date(dt.getTime() + 86400000).getDate() === 1;
}