const getProfile = require("../../../utils/profile")

module.exports = {
    name: 'profile',
    description: 'Displays your profile.',
    guildOnly: true,
    aliases: ['rank', 'pfp', 'level'],
    async execute(message, args) {
        const user = message.author;
        const member = message.guild.members.cache.get(user.id);
        const profile = await user.profile();

        const level = await member.getLevel();

        const sortUsers = await message.client.GuildUsers.find({guildID: message.guild.id}).sort({messages: -1});
        const userRank = sortUsers.findIndex(gUser => gUser.userID === user.id) + 1;

        const userProfile = {
            name: user.username,
            userID: user.id,
            title: profile.title,
            level: level.toString(),
            rank: userRank,
            bg: profile.currentBg,
            flare: profile.currentFlare,
            animated: profile.animated,
            imgURL: user.displayAvatarURL( { format: 'png', size: 1024 } ),
        }

        message.channel.send(`\`Generating Profile...\``).then(async (msg) => {
            const profileBuffer = await getProfile(userProfile);
            message.channel.send({
                files: [{
                    attachment: profileBuffer,
                    name: 'profile.png'
                }]
            }).then(() => msg.delete());    
        });
    }
}