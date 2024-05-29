const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const config = require('../../../config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('lock-channel')
    .setDescription('Remove a member to the ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(ch => 
        ch
        .setName('ch')
        .setDescription('Mention the channel you want to lock')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const ch = interaction.options.getChannel('ch')
      
        if (ch) {
            ch.permissionOverwrites.edit(config.memberId, {
                ViewChannel: true, SendMessages: false,
            })
            ch.permissionOverwrites.edit(config.allowlistRole, {
                ViewChannel: true, SendMessages: false,
            })
            .then(() => {
                interaction.reply(`**> ${ch} Has Been Locked!**`);
            })
            .catch(console.error);
        } else {
            interaction.reply({ content: "**> Please Mention A Valid Channel.**", ephemeral: true });
        }
    }
}