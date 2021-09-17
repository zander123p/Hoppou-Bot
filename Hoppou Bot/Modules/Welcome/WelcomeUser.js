module.exports = {
    eventType: 'guildMemberUpdate',
    async event(client, oldMember, newMember) {
        const chanl = await newMember.guild.getModuleSetting(this.module, 'welcome_channel');
        let msg = await newMember.guild.getModuleSetting(this.module, 'welcome_message');
        const welcomeRole = await newMember.guild.getModuleSetting(this.module, 'welcome_role');
        if (!chanl || !msg || !welcomeRole) {
            return;
        }

        const channel = oldMember.guild.channels.cache.get(chanl);

        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const role = newMember.roles.cache.difference(oldMember.roles.cache);
            if (role.first().id === welcomeRole) {
                msg = msg.replaceAll('{{user}}', oldMember);
                msg = msg.replaceAll('{{server}}', oldMember.guild);
                // const memberCount = newMember.guild.roles.cache.get(welcomeRole).members.size;
                const memberCount = newMember.guild.memberCount;
                msg = msg.replaceAll('{{count}}', `${memberCount}${([4, 5, 6, 7, 8, 9, 0].includes(memberCount % 10)) ? 'th' : (([1].includes(memberCount % 10)) ? 'st' : (([2].includes(memberCount % 10)) ? 'nd' : 'rd'))}`);
                msg = msg.replaceAll('{{line}}', '\n');

                channel.send(msg);
            }
        }
    },
};