const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const config = require('../../../config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('unlock-channel')
    .setDescription('Remove a member to the ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(ch => 
        ch
        .setName('channel')
        .setDescription('Mention the channel you want to unlock')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const ch = interaction.options.getChannel('ch')
      
        if (ch) {
            ch.permissionOverwrites.edit(config.memberId, {
                ViewChannel: true, SendMessages: true,
            })
            ch.permissionOverwrites.edit(config.allowlistRole, {
                ViewChannel: true, SendMessages: true,
            })
            .then(() => {
                interaction.reply(`**> ${ch} Has Been Unlocked!**`);
            })
            .catch(console.error);
        } else {
            interaction.reply({ content: "**> Please Mention A Valid Channel.**", ephemeral: true });
        }
    }
}