const { SlashCommandBuilder} = require('@discordjs/builders');
const fs = require('fs')
const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
data:new SlashCommandBuilder()
    .setName('bans')
    .setDescription('Search For A Ban')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(info =>
        info
        .setName('info')
        .setDescription('Member info')
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const info = interaction.options.getString('info')
        console.log(info)
        const bansU = await interaction.guild.bans.fetch()
        console.log(bansU)
        if(bansU.length === 0) return interaction.reply(`**> No bans in this guild.**`)
        let banT = bansU.find(ban => ban.user.id === info)
        let banT2 = []
        let count = 0
        if(!banT) {
            console.log(1)
            bansU.forEach(ban => {
                if(ban.user.username.toLowerCase().includes(info)) {
                    banT2[count] = ban
                    count++
                }
            })
            console.log(banT2)
            if(banT2.length === 0) {
                console.log("TTTTTTTTT")
                return interaction.reply(`**> \`No bans for ${info}\`**`)
            }
            else {
                let banInfo = ""
                for(let i = 0; i < banT2.length; i++) {
                    console.log("---------")
                    console.log(banT2)
                    console.log(i)
                    console.log(banT2[i].user.id)
                    banInfo += `> **User: <@${banT2[i].user.id}> \`(${banT2[i].user.tag} | ${banT2[i].user.id})\`**\n\n`
                }
                return interaction.reply({ content: banInfo })
            }
        }
        else {
            return interaction.reply(`> **User: <@${banT.user.id}> \`(${banT.user.tag})\`**\n\n`)
        }
        
       
        
        
    }
}