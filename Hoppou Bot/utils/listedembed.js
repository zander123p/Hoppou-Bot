const { MessageEmbed } = require("discord.js");

module.exports = class ListedEmbed {
    constructor() {
        this.embed = new MessageEmbed();
        this.fields = [];
        this.fieldCount = 0;
        this.page = 1;
        return this;
    }

    setTitle(title) {
        this.embed.setTitle(title);
        return this;
    }

    setColor(colour) {
        this.embed.setColor(colour);
        return this;
    }
    
    setAuthor(author, icon = '', url = '') {
        this.embed.setAuthor(author, icon, url);
        return this;
    }

    setDescription(description) {
        this.embed.setDescription(description)
        return this;
    }

    setImage(url) {
        this.embed.setImage(url);
        return this;
    }

    setThumbnail(url) {
        this.embed.setThumbnail(url);
        return this;
    }

    setTimestamp(date = '') {
        if (date === '')
            this.embed.setTimestamp();
        else
            this.embed.setTimestamp(date);
        return this;
    }

    addField(title, value, inline = false) {
        this.fields.push({title, value, inline});
        this.fieldCount++;
        return this;
    }

    clearFields() {
        this.fields = [];
        this.fieldCount = 0;
    }

    send(channel, maxSize = 25) {
        if (maxSize > 25)
            maxSize = 25;
        if (maxSize < 1)
            maxSize = 1;
        this.maxSize = maxSize;

        if (this.fieldCount > maxSize) {
            for (let i = 0; i < maxSize; i++) {
                this.embed.addField(this.fields[i].title, this.fields[i].value, this.fields[i].inline);
            }
            this.embed.setFooter(`Page: ${this.page}/${Math.ceil(this.fieldCount / this.maxSize)}`);
            channel.send(this.embed).then(async msg => {
                msg.react('⬅️').then(() => msg.react('➡️'));
                const filter = (reaction, user) => {
                    return !user.bot;
                };
                this.collector = msg.createReactionCollector(filter, { time: 15000 });
                this.collector.on('collect', this.react.bind(null, this));
                this.collector.on('end', this.end.bind(null, msg));
            });
        } else {
            this.fields.forEach(field => {
                this.embed.addField(field.title, field.value, field.inline);
            });
            channel.send(this.embed);
        }
    }

    applyPage(msg, LE) {
        LE.embed.fields = [];
        LE.embed.setFooter(`Page: ${LE.page}/${Math.ceil(LE.fieldCount / LE.maxSize)}`);
        for (let i = 0; i < LE.maxSize; i++) {
            let pagedIndex = i + (LE.maxSize * (LE.page-1));
            try {
                LE.embed.addField(LE.fields[pagedIndex].title, LE.fields[pagedIndex].value, LE.fields[pagedIndex].inline);
            } catch {

            }
        }
        msg.edit(LE.embed);
    }

    async react(LE, reaction, user) {
        if (reaction.emoji.name === '⬅️') {
            LE.page = (LE.page - 1 < 1)? Math.ceil(LE.fieldCount / LE.maxSize) : LE.page - 1;
            await reaction.users.remove(user.id);
            LE.collector.resetTimer();
        } else if (reaction.emoji.name === '➡️') {
            LE.page = (LE.page + 1 > Math.ceil(LE.fieldCount / LE.maxSize))? 1 : LE.page + 1;
            await reaction.users.remove(user.id);
            LE.collector.resetTimer();
        }
        LE.applyPage(reaction.message, LE);
    }

    async end(msg) {
        const botReact = msg.reactions.cache.filter(reaction => reaction.users.cache.has(msg.author.id))
        for (const reaction of botReact.values()) {
            await reaction.users.remove(msg.author.id);
        }
    }
}