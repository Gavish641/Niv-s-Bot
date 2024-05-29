const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const config = require('../../../config.json')

module.exports = {
data:new SlashCommandBuilder()
    .setName('lock-member')
    .setDescription('Lock the ticket from a specific member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(user => 
        user
        .setName('user')
        .setDescription('Who?')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const member = interaction.options.getUser('user')
        if(interaction.channel.parent.id !== config.supportParent && interaction.channel.parent.id !== config.purchaseParent ) return;
      
        if (member) {
            interaction.channel.permissionOverwrites.edit(member.id, {
                ViewChannel: true, SendMessages: false,
            })
            .then(() => {
                interaction.reply(`**> The Ticket Has Been Locked For ${member}**`);
            })
            .catch(console.error);
        } else {
            interaction.reply({ content: "**> Please mention a valid member.**", ephemeral: true });
        }
    }
}