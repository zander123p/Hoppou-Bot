module.exports = {
    eventType: 'botUpdate',
    async event(client) {
        console.log(`[Bot Update] Version: ${await client.getVersion()}`);
    },
};