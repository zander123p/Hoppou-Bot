module.exports = {
    name: 'hug',
    description: 'Hug someone.',
    guildOnly: false,
    args: 1,
    usage: '<user>',
    async execute(message, args) {
        const https = require('https');
        const Discord = require('discord.js');

        const user = await message.getUserFromID(args[0]);

        if (!user) {
            message.reply('please use a valid user.').then(msg => msg.delete({ timeout: 5000 }));
            return message.react('❌');
        }

        https.get(`https://api.tenor.com/v1/search?q=anime+hug&key=${process.env.APIKEY}&limit=25`, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                if (user.id === message.author.id) {
                    const msg = new Discord.MessageEmbed()
                        .setColor('#9a3deb')
                        .setTitle(`${message.author.username}, you have hugged yourself!`)
                        .setImage(JSON.parse(data).results[Math.floor(Math.random() * Object.keys(JSON.parse(data).results).length)].media[0].gif.url);
                    return message.channel.send(msg);
                } else if (user.id === message.client.user.id) {
                    const msg = new Discord.MessageEmbed()
                        .setColor('#9a3deb')
                        .setTitle(`${message.author.username} hugged me!`)
                        .setImage(JSON.parse(data).results[Math.floor(Math.random() * Object.keys(JSON.parse(data).results).length)].media[0].gif.url);
                    return message.channel.send(msg);
                }

                const msg = new Discord.MessageEmbed()
                    .setColor('#9a3deb')
                    .setTitle(`${user.username}, you have been hugged by ${message.author.username}!`)
                    .setImage(JSON.parse(data).results[Math.floor(Math.random() * Object.keys(JSON.parse(data).results).length)].media[0].gif.url);
                message.channel.send(msg);
            });
        });
    }
}