module.exports = {
    eventType: 'guildMemberUpdate',
    async event(client, oldMember, newMember) {
        const chanl = await newMember.guild.getModuleSetting(this.module, 'welcome_channel');
        let msg = await newMember.guild.getModuleSetting(this.module, 'welcome_message');
        const joinFlag = await newMember.guild.getModuleSetting(this.module, 'join_flag');
        if (!chanl || !msg || !joinFlag) {
            return;
        }

        const channel = oldMember.guild.channels.cache.get(chanl);

        msg = msg.replaceAll('{{user}}', oldMember);
        msg = msg.replaceAll('{{server}}', oldMember.guild);
        // const memberCount = newMember.guild.roles.cache.get(welcomeRole).members.size;
        const memberCount = newMember.guild.memberCount;
        msg = msg.replaceAll('{{count}}', `${memberCount}${([4, 5, 6, 7, 8, 9, 0].includes(memberCount % 10)) ? 'th' : (([1].includes(memberCount % 10)) ? 'st' : (([2].includes(memberCount % 10)) ? 'nd' : 'rd'))}`);
        msg = msg.replaceAll('{{line}}', '\n');

        channel.send(msg);
    },
};