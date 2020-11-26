module.exports = {
    name: 'ping',
    description: 'Pong~!',
    execute(message, args) {
        message.channel.send("Pinging...").then(m =>{
            var ping = m.createdTimestamp - message.createdTimestamp;

            m.edit(`**:ping_pong: Pong! Your Ping Is:-**\n  ${ping}ms`);
        });
    },
};