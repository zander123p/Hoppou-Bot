module.exports = {
    eventType: 'error',
    async event(error) {
        console.error(`${error.name}: ${error.message}`);
    },
};