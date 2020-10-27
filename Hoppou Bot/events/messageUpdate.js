module.exports = (client, oldMessage, newMessage) => {
    // TODO: Output to log channel from database.
    console.log(`${oldMessage.author} has Updated their message: '${oldMessage}' -> '${newMessage}'`);
};