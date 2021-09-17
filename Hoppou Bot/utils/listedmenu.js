const { MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');
module.exports = class ListedMenu {
    constructor(callback) {
        this.menu = new MessageSelectMenu();
        this.options = [];
        this.optionCount = 0;
        this.page = 1;
        this.buttons = [];
        this.callback = callback;
        this.title = '';
        return this;
    }

    setTitle(title) {
        this.title = title;
        return this;
    }

    setCustomId(id) {
        this.menu.setCustomId(id);
        return this;
    }

    setDisabled(disabled) {
        this.menu.setDisabled(disabled);
        return this;
    }

    setMaxValues(maxValues) {
        if (maxValues > 25) maxValues = 25;
        this.menu.setMaxValues(maxValues);
        return this;
    }

    setMinValues(minValues) {
        this.menu.setMinValues(minValues);
        return this;
    }

    setPlaceholder(placeholder) {
        this.menu.setPlaceholder(placeholder);
        return this;
    }

    addOption(name, value, description = '', emoji = {}) {
        name = name.toString();
        value = value.toString();
        description = description.toString();

        this.options.push({ label: name, value, description, emoji });
        this.optionCount++;
        return this;
    }

    addButton(label, id, style, callback) {
        const b = new MessageButton()
            .setLabel(label)
            .setCustomId(id)
            .setStyle(style);
        this.buttons.push({ button: b, callback });
    }

    clearOptions() {
        this.options = [];
        this.optionCount = 0;
    }

    send(interaction) {
        if (this.optionCount > 25) {
            const op = [];
            for (let i = 0; i < 25; i++) {
                op.push(this.options[i]);
            }
            this.menu.addOptions(op);

            const row1 = new MessageActionRow()
                .addComponents(
                    this.menu,
                );
            const row2 = new MessageActionRow()
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

            // TODO:
            // Row 3 from buttons list

            interaction.reply({ content: `${(this.title !== '') ? this.title + ' - ' : ''}Page 1/${Math.ceil(this.optionCount / 25)}`, components: [row1, row2] });
            interaction.fetchReply().then(async msg => {
                const filter = (i) => {
                    return !i.user.bot;
                };
                this.collector = msg.createMessageComponentCollector({ filter, time: 50000 });
                this.collector.on('collect', this.action.bind(null, this));
                this.collector.on('end', this.end.bind(null, msg));
            });
        } else {
            const op = [];
            for (let i = 0; i < this.optionCount; i++) {
                op.push(this.options[i]);
            }
            this.menu.addOptions(op);
            const row1 = new MessageActionRow()
                .addComponents(
                    this.menu,
                );
            interaction.reply({ content: (this.title !== '') ? this.title : '⠀', components: [row1] });
            interaction.fetchReply().then(async msg => {
                const filter = (i) => {
                    return !i.user.bot;
                };
                this.collector = msg.createMessageComponentCollector({ filter, time: 50000 });
                this.collector.on('collect', this.action.bind(null, this));
                this.collector.on('end', this.end.bind(null, msg));
            });
        }
    }

    ApplyChanges(i) {
        this.applyChanges(i.message, this);
        i.deferUpdate();
    }

    applyChanges(msg, LM) {
        LM.menu.options = [];
        const op = [];
        for (let i = 0; i < 25; i++) {
            const pagedIndex = i + (25 * (LM.page - 1));
            if (!LM.options[pagedIndex]) continue;
            op.push(LM.options[pagedIndex]);
        }

        LM.menu.setMaxValues(op.length);
        LM.menu.addOptions(op);

        const row1 = new MessageActionRow()
            .addComponents(
                this.menu,
            );
        const row2 = new MessageActionRow()
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

        if (LM.options.length < 25) {
            msg.edit({ content: (this.title !== '') ? this.title : '⠀', components: [row1] });
        } else {
            msg.edit({ content: `${(this.title !== '') ? this.title + ' - ' : ''}Page ${this.page}/${Math.ceil(this.optionCount / 25)}`, components: [row1, row2] });
        }
    }

    async action(LM, i) {
        if (!i.isButton()) return LM.callback(i);
        if (i.customId === 'pre') {
            LM.page = (LM.page - 1 < 1) ? Math.ceil(LM.optionCount / 25) : LM.page - 1;
            LM.collector.resetTimer();
        } else if (i.customId === 'nxt') {
            LM.page = (LM.page + 1 > Math.ceil(LM.optionCount / 25)) ? 1 : LM.page + 1;
            LM.collector.resetTimer();
        }
        LM.applyChanges(i.message, LM);
        i.deferUpdate();
    }

    async end(msg) {
        msg.delete();
    }
};