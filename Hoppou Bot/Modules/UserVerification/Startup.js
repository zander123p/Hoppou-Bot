module.exports = {
    eventType: 'ready',
    async event(client) {
        // client.guilds.cache.forEach(async guild => {
        //     const g = await guild.ensure();

        //     if (g.settings.UserVerification.auto) {
        //         const offsetS = g.settings.UserVerification.timeOffset;

        //         const newUsers = await client.GuildNewJoins.find({ guildID: guild.id });

        //         newUsers.forEach(user => {
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
}