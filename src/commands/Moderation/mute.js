const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const config = require('../../../config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute Member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(user => 
        user
        .setName('user')
        .setDescription('Who?')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const userId = interaction.options.getUser('user').id
        const user = interaction.guild.members.cache.get(userId)
        if(user.roles.cache.find(role => role.id === config.muteRoleId)) {
            return interaction.reply({ content: `**> ${user} is already muted**`, ephemeral: true })
        }
        user.roles.add(config.muteRoleId)
        interaction.reply({ content: `**> ${user} got muted successfully!**` })
        
        
    }
}