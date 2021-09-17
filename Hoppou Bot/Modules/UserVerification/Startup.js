module.exports = {
    eventType: 'ready',
    async event(client) {
        const newUsers = await client.GuildNewJoins.find({});

        if (newUsers) {
            newUsers.forEach(async usp => {
                const userID = usp.userID;
                const guildID = usp.guildID;
                const messageID = usp.messageID;

                const guild = client.guilds.cache.get(guildID);
                if (!guild) return;
                const user = guild.members.cache.get(userID);
                const channel = guild.channels.cache.get(await guild.getModuleSetting(this.module, 'channel'));
                try {
                    const message = await channel.messages.fetch(messageID);
                    if (!user) {
                        message.delete();
                        await client.GuildNewJoins.findOneAndDelete({ userID, guildID });
                    }

                    if (user.roles.cache.has(guild.roles.cache.get(await guild.getModuleSetting(this.module, 'role')))) {
                        message.delete();
                        await client.GuildNewJoins.findOneAndDelete({ userID, guildID });
                    }
                } catch (err) {
                    console.log(err);
                    console.log(`Invalid message in database\nMessageID: ${messageID}\nUserID: ${userID}\nGuildID: ${guildID}`);
                }
            });
        }

        // client.guilds.cache.forEach(async guild => {
        //     const g = await guild.ensure();

        //     if (g.settings.UserVerification.auto) {
        //         const offsetS = g.settings.UserVerification.timeOffset;

        //         const newGuildUsers = await client.GuildNewJoins.find({ guildID: guild.id });

        //         newGuildUsers.forEach(user => {
        //             const date = user.when;

        //             let finDate;
        //             if (offsetS.endsWith('m')) {
        //                 const copy = date;

        //                 let offset = offsetS.slice(0, -1);
        //                 offset = parseInt(offset);
        //                 copy.setMinutes(copy.getMinutes() + offset);
        //                 finDate = copy;

        //             } else if (offsetS.endsWith('h')) {
        //                 const copy = date;

        //                 let offset = offsetS.slice(0, -1);
        //                 offset = parseInt(offset);
        //                 copy.SetHours(copy.getHours() + offset);
        //                 finDate = copy;

        //             } else if (offsetS.endsWith('d')) {
        //                 const copy = date;

        //                 let offset = offsetS.slice(0, -1);
        //                 offset = parseInt(offset);
        //                 copy.setDate(copy.getDate() + offset);
        //                 finDate = copy;

        //             }

        //             if (Date.now >= finDate) {

        //             }
        //         });
        //     }
        // });
    },
};