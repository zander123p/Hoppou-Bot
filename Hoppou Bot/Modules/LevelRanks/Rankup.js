module.exports = {
    eventType: 'guildMemberLevelup',
    module: 'LevelRanks',
    async event(client, member, guild) {
        const g = await guild.ensure();
        const level = await member.getLevel();

        if (!g.settings.modules.includes(module.exports.module)) return;

        g.settings.ranks.forEach(r => {
            let role = guild.roles.cache.get(r.id);
            if (level >= r.level && !member.roles.cache.get(r.id)) {
                member.roles.add(role);
            } else if (level <= r.level && member.roles.cache.get(r.id)) {
                member.roles.remove(role);
            }
        });
    }
}