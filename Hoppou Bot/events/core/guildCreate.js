module.exports = async (client, guild) => {
    await client.Guilds.findOneAndDelete({guildID: guild.id});
}