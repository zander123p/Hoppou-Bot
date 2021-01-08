const Discord = require('discord.js');
const moment = require('moment');
module.exports = {
    name: 'showactions',
    description: 'Shows the moderation actions taken on the user provided.',
    guildOnly: true,
    guildPermission: 'mod.check',
    aliases: ['sa'],
    args: 1,
    usage: '<user> [warnings or kicks]',
    async execute(message, args) {
        const target = await message.getUserFromID(args[0]);
        //const warnIDs = message.client.userProfiles.get(target.id, 'warnings');
        //const warnData = warnIDs.map(id => '+' + message.client.modActions.get(id).reason + '\n');
        if (!target)
            return message.reply(`please mention the user you want would like to see more about.`);
        if (!args[1]) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Mod Actions for ${target.tag}`)
                .setColor('#158559')
                .setThumbnail(target.displayAvatarURL());
            const profile = await message.client.UserProfiles.findOne({userID: target.id});
            embed.addField(`Target name and id`, `${target.tag}:${target.id}`)
            embed.addField(`Warnings`, profile.warnings.length);
            embed.addField(`Kicks`, profile.kicks.length);
            embed.addField(`Total Actions`, profile.totalActions);
            message.channel.send(embed);
        } else if (args[1].includes('warn')) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Warnings for ${target.tag}`)
                .setColor('#158559')
                .setThumbnail(target.displayAvatarURL());
            const profileWarns = await message.client.UserProfiles.findOne({userID: target.id});
            const currentWarn = profileWarns.warnings[0];
            const warning = await message.client.ActionLogs.findOne({_id: currentWarn});
            const moderator = await message.getUserFromID(warning.moderator);

            embed.addField(`Moderator`, moderator.tag);
            embed.addField(`Reason`, warning.reason);
            embed.addField(`Time`, moment(warning.when).format('MMMM Do YYYY, h:mm:ss a'));
            embed.setFooter(`Page: 1/${profileWarns.warnings.length}`);

            const filter = (reaction, user) => {
                return !user.bot;
            };

            message.channel.send(embed).then(msg => {
                let page = 0;
                msg.react('⬅️').then(() => msg.react('➡️'));
                let collector = msg.createReactionCollector(filter, { time: 15000 });
                collector.on('collect', async (reaction, user) => {
                    const profileWarns = await message.client.UserProfiles.findOne({userID: target.id});
                    if (reaction.emoji.name === '⬅️') {
                        if (page - 1 < 0)
                            page = profileWarns.warnings.length-1;
                        else
                            page--;
                        collector.resetTimer();
                    } else if (reaction.emoji.name === '➡️') {
                        if (page + 1 >= profileWarns.warnings.length)
                            page = 0;
                        else
                            page++;
                        collector.resetTimer();
                    }
                    const currentWarn = profileWarns.warnings[page];
                    const warning = await message.client.ActionLogs.findOne({_id: currentWarn});
                    const moderator = await message.getUserFromID(warning.moderator);
        
                    embed.fields = [];
                    embed.addField(`Moderator`, moderator.tag);
                    embed.addField(`Reason`, warning.reason);
                    embed.addField(`Time`, moment(warning.when).format('MMMM Do YYYY, h:mm:ss a'));
                    embed.setFooter(`Page: ${page+1}/${profileWarns.warnings.length}`);
                
                    msg.edit(embed);
                });

                collector.on('end', async collected => {
                    const botReact = msg.reactions.cache.filter(reaction => reaction.users.cache.has(msg.author.id))
                    for (const reaction of botReact.values()) {
                        await reaction.users.remove(msg.author.id);
                    }
                });
            });
        } else if (args[1].includes('kick')) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Kicks for ${target.tag}`)
                .setColor('#158559')
                .setThumbnail(target.displayAvatarURL());
            const profile = await message.client.UserProfiles.findOne({userID: target.id});
            const currentKick = profile.kicks[page];
            const kick = await message.client.ActionLogs.findOne({_id: currentKick});
            const moderator = await message.getUserFromID(kick.moderator);

            embed.addField(`Moderator`, moderator.tag);
            embed.addField(`Reason`, kick.reason);
            embed.addField(`Time`, moment(kick.when).format('MMMM Do YYYY, h:mm:ss a'));
            embed.setFooter(`Page: 1/${profile.kicks.length}`);
            const filter = (reaction, user) => {
                return !user.bot;
            };

            message.channel.send(embed).then(msg => {
                let page = 0;
                msg.react('⬅️').then(() => msg.react('➡️'));
                let collector = msg.createReactionCollector(filter, { time: 15000 });
                collector.on('collect', (reaction, user) => {
                    const profileKicks = message.client.userProfiles.get(target.id, 'kicks');
                    if (reaction.emoji.name === '⬅️') {
                        if (page - 1 < 0)
                        page = profileKicks.length-1;
                        else
                        page--;
                        collector.resetTimer();
                    } else if (reaction.emoji.name === '➡️') {
                        if (page + 1 >= profileKicks.length)
                        page = 0;
                        else
                        page++;
                        collector.resetTimer();
                    }
                    const currentKick = profileKicks[page];
    
                    embed.fields = [];
                    embed.addField(`Moderator`, message.getUserFromID(message.client.modActions.get(currentKick).moderator).tag);
                    embed.addField(`Reason`, message.client.modActions.get(currentKick).reason);
                    embed.addField(`Time`, moment(message.client.modActions.get(currentKick).when).format('MMMM Do YYYY, h:mm:ss a'));
                    embed.setFooter(`Page: ${page+1}/${profileKicks.length}`);
                
                    msg.edit(embed);
                });

                collector.on('end', async collected => {
                    const botReact = msg.reactions.cache.filter(reaction => reaction.users.cache.has(msg.author.id))
                    for (const reaction of botReact.values()) {
                        await reaction.users.remove(msg.author.id);
                    }
                });
            });
        }
    },
};