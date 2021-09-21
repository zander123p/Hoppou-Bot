module.exports = {
    name: 'eval',
    description: 'danger',
    guildOnly: true,
    guildPermission: 'bot owner',
    args: 1,
    usage: '<?>',
    async execute(message, args) {
        if (message.author.id !== '99604105298731008') {
            return message.react('❌');
        }

        let code = args.join(' ');

        const clean = text => {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        try {
            let evaled = await eval(`(async () => {${code}})()`);

            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled);
            }

            message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
}