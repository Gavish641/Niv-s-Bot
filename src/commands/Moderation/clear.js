const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, Embed} = require("discord.js");

module.exports = {
data:new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear a specific amount of message from a target or channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option => 
        option
        .setName('amount')
        .setDescription('Amount of messages to delete')
        .setRequired(true)
    )
    .addUserOption(option =>
        option
        .setName('target')
        .setDescription('Selet a target to delete thier messages')
        .setRequired(false)
    ),
    async execute(interaction, client) {
        const amount = interaction.options.getInteger('amount')
        const target = interaction.options.getUser('target')
        
        const messages = await interaction.channel.messages.fetch({
            limit: amount +1,
        });

        if(target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if(msg.author.id === target.id && amount > i) {
                    filtered.push(msg)
                    i++;
                }
            })

            await interaction.channel.bulkDelete(filtered).then(messages => {
                interaction.reply({ content: `**> Succesfully deleted ${messages.size} messages from ${target}**`, ephemeral: true })
            })
        } else {
            await interaction.channel.bulkDelete(amount, true).then(messages => {
                interaction.reply({ content: `**> Succesfully deleted ${messages.size} messages**`, ephemeral: true })
            })
        }
    }
}