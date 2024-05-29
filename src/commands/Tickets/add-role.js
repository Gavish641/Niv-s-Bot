const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const config = require('../../../config.json')

module.exports = {
data:new SlashCommandBuilder()
    .setName('add-role')
    .setDescription('Add a role to the ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addRoleOption(role => 
        role
        .setName('role')
        .setDescription('Who?')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const member = interaction.options.getRole('role')
        if(interaction.channel.parent.id !== config.supportParent && interaction.channel.parent.id !== config.purchaseParent ) return;
        if (member) {
            interaction.channel.permissionOverwrites.edit(member.id, {
                ViewChannel: true, SendMessages: true,
            })
            .then(() => {
                interaction.reply(`**> ${member} Has Been Added To The Ticket!**`);
            })
            .catch(console.error);
        } else {
            interaction.reply({ content: "**> Please mention a valid role.**", ephemeral: true });
        }
    }
}