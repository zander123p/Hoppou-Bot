module.exports = {
    name: 'ping',
    description: 'Ping~!',
    execute(message, args) {
        message.reply(`pong with ${message.createdTimestamp - Date.now()}ms delay!`);
    },
};