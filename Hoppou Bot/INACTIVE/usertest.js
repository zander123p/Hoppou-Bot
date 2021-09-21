module.exports = {
    name: 'usertest',
    description: 'Test user ping~!',
    async execute(message, args) {
        const { MessageEmbed } = require("discord.js");
        const msg = args;

        let msgWarp = '';
        let line = ' ';
        msg.forEach(word => {
            if (line.length + word.length < 50) {
                line += word + ' ';
            } else {
                msgWarp += line + '\n';
                line = ' ';
            }
        });

        if (line.length > 1) {
            msgWarp += line;
        }

        msgWarp.replace('undefined', ' ');

        const me = new MessageEmbed()
            .setColor('#9a3deb')
            .setTitle('Word Wrap Test')
            .addField('Message', '```' + msgWarp + '```')

        message.channel.send(me);
    },
};