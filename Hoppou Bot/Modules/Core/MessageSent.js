module.exports = {
    eventType: 'messageCreate',
    async event(client, message) {
        if (message.author.bot) return;
        if (!message.guild) return;
        const user = await message.guild.members.cache.get(message.author.id).ensure();

        user.messages = user.messages + 1;

        try {
            await user.save();
        } catch (err) { console.log(err); }

        // if (!message.content.toLowerCase().startsWith(prefix)) return;

        // const args = message.content.slice(prefix.length).trim().split(/ +/);
        // const commandName = args.shift().toLowerCase();

        // const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        // if (!command) return message.reply(`the command '${commandName}' does not exsit. Please make sure you typed it correctly!\nFor a list of all commands, type \`${prefix}help\``);

        // if (command.guildOnly && message.channel.type === 'dm') return message.reply('I can\'t execute that command inside DMs!');

        // // if (message.guild && !message.guild.member(message.author).hasPermission(command.permissions)) return message.reply('you don\'t have the required permissions to run that command!');

        // if (message.guild && !await message.guild.members.cache.get(message.author.id).hasGuildPermission(command.guildPermission)) return message.reply('you don\'t have the required permissions to run that command!').then(msg => msg.delete({
        //     timeout: 5000,
        // }));

        // if (command.args && !args.length || args.length < command.args) {
        //     let reply = (args.length < command.args && args.length != 0) ? 'you didn\'t provide enough arguments!' : 'you didn\'t provide any arguments!';

        //     if (command.usage) {
        //         reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        //     }

        //     return message.reply(reply).then(msg => msg.delete({
        //         timeout: 5000,
        //     }));
        // }

        // try {
        //     command.execute(message, args);
        // } catch (error) {
        //     console.error(error);
        //     message.reply('there was an error running this command!').then(msg => msg.delete({
        //         timeout: 5000,
        //     }));
        // }
    },
};