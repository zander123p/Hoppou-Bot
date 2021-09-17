module.exports = {
    eventType: 'guildMemberLevelup',
    async event(client, member, guild) {
        const level = await member.getLevel();
        const ranks = await guild.getModuleSetting(this.module, 'ranks');
        ranks.forEach(r => {
            const role = guild.roles.cache.get(r.id);
            if (level >= r.level && !member.roles.cache.get(r.id)) {
                member.roles.add(role);
            } else if (level <= r.level && member.roles.cache.get(r.id)) {
                member.roles.remove(role);
            }
        });
    },
};