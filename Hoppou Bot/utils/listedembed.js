const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

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
        this.embed.setDescription(description);
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
        this.fields.push({ title, value, inline });
        this.fieldCount++;
        return this;
    }

    clearFields() {
        this.fields = [];
        this.fieldCount = 0;
    }

    send(interaction, maxSize = 25) {
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

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel('Previous')
                        .setCustomId('pre')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setLabel('Next')
                        .setCustomId('nxt')
                        .setStyle('PRIMARY'),
                );

            interaction.reply({ embeds: [this.embed], components: [row] });
            interaction.fetchReply().then(async msg => {
                const filter = (i) => {
                    return !i.user.bot;
                };
                this.collector = msg.createMessageComponentCollector({ filter, time: 15000 });
                this.collector.on('collect', this.action.bind(null, this));
                this.collector.on('end', this.end.bind(null, msg));
            });
        } else {
            this.fields.forEach(field => {
                this.embed.addField(field.title.toString(), field.value.toString(), field.inline);
            });
            interaction.reply({ embeds: [this.embed] });
        }
    }

    applyPage(msg, LE) {
        LE.embed.fields = [];
        LE.embed.setFooter(`Page: ${LE.page}/${Math.ceil(LE.fieldCount / LE.maxSize)}`);
        for (let i = 0; i < LE.maxSize; i++) {
            const pagedIndex = i + (LE.maxSize * (LE.page - 1));
            try {
                LE.embed.addField(LE.fields[pagedIndex].title.toString(), LE.fields[pagedIndex].value.toString(), LE.fields[pagedIndex].inline);
            } catch (err) {
                console.log(err);
            }
        }
        msg.edit({ embeds: [LE.embed] });
    }

    async action(LE, i) {
        if (i.customId === 'pre') {
            LE.page = (LE.page - 1 < 1) ? Math.ceil(LE.fieldCount / LE.maxSize) : LE.page - 1;
            LE.collector.resetTimer();
        } else if (i.customId === 'nxt') {
            LE.page = (LE.page + 1 > Math.ceil(LE.fieldCount / LE.maxSize)) ? 1 : LE.page + 1;
            LE.collector.resetTimer();
        }
        i.deferUpdate();
        LE.applyPage(i.message, LE);
    }

    async end(msg) {
        msg.edit({ components: [] });
    }
};