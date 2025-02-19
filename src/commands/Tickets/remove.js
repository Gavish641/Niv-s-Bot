const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const config = require('../../../config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a member to the ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(user => 
        user
        .setName('user')
        .setDescription('Who?')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        if(interaction.channel.parent.id !== config.supportParent && interaction.channel.parent.id !== config.purchaseParent ) return;
        const member = interaction.options.getUser('user')
      
        if (member) {
            interaction.channel.permissionOverwrites.edit(member.id, {
                ViewChannel: false, SendMessages: false,
            })
            .then(() => {
                interaction.reply(`**> ${member} Has Been Removed From The Ticket!**`);
            })
            .catch(console.error);
        } else {
            interaction.reply({ content: "**> Please Mention A Valid Member.**", ephemeral: true });
        }
    }
}