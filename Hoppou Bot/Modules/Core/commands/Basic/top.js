module.exports = {
    name: 'top',
    description: 'Get the top 10 of a category.',
    options: [
        {
            name: 'category',
            description: 'Category to view',
            type: 'STRING',
            choices: [
                {
                    name: 'Messages',
                    value: 'tp_messages',
                },
                {
                    name: 'VCs',
                    value: 'tp_vc',
                },
            ],
            required: false,
        },
        {
            name: 'all',
            type: 'BOOLEAN',
            description: 'Whether to view all of that category',
        },
    ],
    async execute(interaction) {
        const ListedEmbed = require('../../../../utils/listedembed');
        const members = await interaction.client.GuildUsers.find({ guildID: interaction.member.guild.id });
        let cat;
        let all;
        if (interaction.options.get('category'))
            cat = interaction.options.get('category').value;
        if (interaction.options.get('all'))
            all = interaction.options.get('all').value;

        const guild = interaction.member.guild;

        if (members.length === 0) {
            return interaction.reply({ content: 'no valid users found', ephemeral: true });
        }

        if ((!cat && !all) || all || cat === 'tp_messages') {
            const sortUsers = await interaction.client.GuildUsers.find({ guildID: guild.id }).sort({ messages: -1 });

            const embed = new ListedEmbed()
                .setColor('#9a3deb')
                .setTitle('Top Message Senders');

            const displayCount = (sortUsers.length < 10 || all) ? sortUsers.length : 10;

            for (let i = 0; i < displayCount; i++) {
                const member = guild.members.cache.get(sortUsers[i].userID);
                if (!member) continue;
                embed.addField(`${member.user.tag}`, `Rank: #${i + 1}\nMessages: ${sortUsers[i].messages}`);
            }

            embed.send(interaction, 10);
        } else if (cat === 'tp_vc') {
            const users = await interaction.client.GuildUsers.find({ guildID: guild.id });

            let sortUsers = [];
            users.forEach(user => {
                if (user.VCTracker === undefined) return;
                if (user.VCTracker.length === 0) return;
                sortUsers.push(user);
            });
            sortUsers = sortUsers.sort((a, b) => {
                let aCount = 0;
                a.VCTracker.forEach(v => aCount += v.mins);
                let bCount = 0;
                b.VCTracker.forEach(v => bCount += v.mins);

                return bCount - aCount;
            });

            const embed = new ListedEmbed()
                .setColor('#9a3deb')
                .setTitle('Top Voice Channel Spenders');

            const displayCount = (sortUsers.length < 10) ? sortUsers.length : 10;

            for (let i = 0; i < displayCount; i++) {
                const member = guild.members.cache.get(sortUsers[i].userID);
                embed.addField(`${member.user.tag}`, (`Rank: #${i + 1}\n${
                    (sortUsers[i].VCTracker.length === 1) ? `${
                        guild.channels.cache.get(sortUsers.VCTracker[0].id).name
                    }: ${sortUsers[i].VCTracker[0].mins} Minutes` : sortUsers[i].VCTracker.map((VCT, j) => {
                        const vc = guild.channels.cache.get(VCT.id);

                        return (`${vc.name}: ${VCT.mins} Minutes${(sortUsers[i].VCTracker.length !== j + 1) ? '\n' : ''}`);
                })}`).replace(/,/g, ''));
            }

            embed.send(interaction, 1);
        }
    },
};