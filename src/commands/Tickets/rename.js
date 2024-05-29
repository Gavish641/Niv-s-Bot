const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const config = require('../../../config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Rename the ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addStringOption(name => 
        name
        .setName('name')
        .setDescription('New name for the ticket')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        if(interaction.channel.parent.id !== config.supportParent && interaction.channel.parent.id !== config.purchaseParent ) return;
        const newName = interaction.options.getString('name')
        interaction.channel.setName(newName)
        interaction.reply({ content: `**> The Ticket Name Successfully Changed To \`${newName}\`**` })
        
        
        
    }
}