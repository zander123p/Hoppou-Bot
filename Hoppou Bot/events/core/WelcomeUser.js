module.exports = {
    eventType: 'guildMemberUpdate',
    async event(client, oldMember, newMember) {
        const g = await oldMember.guild.ensure();
        const chanl = g.settings.welcomeChannel;
        if (!chanl) {
            return;
        }

        const channel = oldMember.guild.channels.cache.get(chanl);

        if (!g.settings.welcomeMessage) {
            return;
        }

        if (!g.settings.newcommerRole) {
            return;
        }

        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const role = newMember.roles.cache.difference(oldMember.roles.cache);
            if (role.first().id === g.settings.newcommerRole) {
                let msg = g.settings.welcomeMessage;
                msg = msg.replace('<@user>', oldMember);
                msg = msg.replace('<@server>', oldMember.guild);
                const memberCount = oldMember.guild.roles.cache.get(g.settings.newcommerRole).members.size;
                msg = msg.replace('<@count>', `${memberCount}${([4,5,6,7,8,9,0].includes(memberCount % 10))? 'th' : (([1].includes(memberCount % 10))? 'st' : (([2].includes(memberCount % 10))? 'nd' : 'rd'))}`);

                channel.send(msg);
            }
        }
    }
};