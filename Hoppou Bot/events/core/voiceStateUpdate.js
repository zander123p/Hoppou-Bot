module.exports = async (client, oldState, newState) => {
    const g = await newState.guild.ensure();
    const c = g.settings.VCTrackerChannels[g.settings.VCTrackerChannels.indexOf((oldState.channel)? oldState.channel.id : newState.channel.id)];

    if (!c) return;
    if (oldState.member.user.bot || newState.member.user.bot) return;

    if (!oldState.channel && newState.channel) {
        if (client.VCTracker.get(newState.member.id)) {
            clearInterval(client.VCTracker.get(newState.member.id));
            client.VCTracker.delete(newState.member.id);
        }
        let tracker = setInterval(async () => {
            const user = await newState.member.ensure();
            let t = user.VCTracker.find(tracker => tracker.id === newState.channel.id);
            if (t) {
                user.VCTracker[user.VCTracker.indexOf(t)].mins = user.VCTracker[user.VCTracker.indexOf(t)].mins + 1;
                await user.save();
            } else {
                user.VCTracker.push({id: newState.channel.id, mins: 1});
                await user.save();
            }
        }, 60000);
        client.VCTracker.set(newState.member.id, tracker);
    } else if (!newState.channel) {
        clearInterval(client.VCTracker.get(newState.member.id));
        client.VCTracker.delete(newState.member.id);
    } else if (oldState.channel.id !== newState.channel.id) {
        clearInterval(client.VCTracker.get(newState.member.id));
        client.VCTracker.delete(newState.member.id);
        let tracker = setInterval(async () => {
            const user = await newState.member.ensure();
            let t = user.VCTracker.find(tracker => tracker.id === newState.channel.id);
            if (t) {
                user.VCTracker[user.VCTracker.indexOf(t)].mins = user.VCTracker[user.VCTracker.indexOf(t)].mins + 1;
                await user.save();
            } else {
                user.VCTracker.push({id: newState.channel.id, mins: 1});
                await user.save();
            }
        }, 60000);
        client.VCTracker.set(newState.member.id, tracker);
    }
};