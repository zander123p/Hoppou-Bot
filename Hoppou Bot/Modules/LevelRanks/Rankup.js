module.exports = {
    eventType: 'guildMemberLevelup',
    async event(client, member, guild) {
        const level = await member.getLevel();

        await guild.getModuleSetting(this.module, 'ranks').forEach(r => {
            const role = guild.roles.cache.get(r.id);
            if (level >= r.level && !member.roles.cache.get(r.id)) {
                member.roles.add(role);
            } else if (level <= r.level && member.roles.cache.get(r.id)) {
                member.roles.remove(role);
            }
        });
    },
};