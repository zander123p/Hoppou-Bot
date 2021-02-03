const getProfile = require("../../../utils/profile")

module.exports = {
    name: 'profile',
    description: 'Displays your profile.',
    guildOnly: true,
    async execute(message, args) {
        const user = message.author;
        const member = message.guild.members.cache.get(user.id);
        const profile = await user.profile();

        const level = await member.getLevel();

        const userProfile = {
            name: user.username,
            userID: user.id,
            title: profile.title,
            level: level.toString(),
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