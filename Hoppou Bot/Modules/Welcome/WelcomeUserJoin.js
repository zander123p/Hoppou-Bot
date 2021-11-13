module.exports = {
    eventType: 'guildMemberAdd',
    async event(client, member) {
        const chanl = await member.guild.getModuleSetting(this.module, 'welcome_channel');
        let msg = await member.guild.getModuleSetting(this.module, 'welcome_message');
        const joinFlag = await member.guild.getModuleSetting(this.module, 'join_flag');
        if (!chanl || !msg || !joinFlag) {
            return;
        }

        const channel = member.guild.channels.cache.get(chanl);

        msg = msg.replaceAll('{{user}}', member);
        msg = msg.replaceAll('{{server}}', member.guild);
        // const memberCount = newMember.guild.roles.cache.get(welcomeRole).members.size;
        const memberCount = member.guild.memberCount;
        msg = msg.replaceAll('{{count}}', `${memberCount}${([4, 5, 6, 7, 8, 9, 0].includes(memberCount % 10)) ? 'th' : (([1].includes(memberCount % 10)) ? 'st' : (([2].includes(memberCount % 10)) ? 'nd' : 'rd'))}`);
        msg = msg.replaceAll('{{line}}', '\n');

        channel.send(msg);
    },
};