const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const config = require('../../../config.json')
module.exports = {
data:new SlashCommandBuilder()
    .setName('receipt')
    .setDescription('Send a receipt to a customer')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(user => 
        user
        .setName('user')
        .setDescription('The Customer')
        .setRequired(true)
    )
    .addStringOption(name => 
        name
        .setName('name')
        .setDescription("Customer's name")
        .setRequired(true)
    )
    .addStringOption(date => 
        date
        .setName('date')
        .setDescription('Date of purchase')
        .setRequired(true)
    )
    .addStringOption(amount => 
        amount
        .setName('amount')
        .setDescription('Amount of purchase')
        .setRequired(true)
    )
    .addStringOption(details => 
        details
        .setName('details')
        .setDescription('What did the customer purchase')
        .setRequired(true)
    )
    .addStringOption(notes => 
        notes
        .setName('notes')
        .setDescription('Notes of the purchase (if any)')
        .setRequired(false)
    ),
    async execute(interaction, client) {
        const userId = interaction.options.getUser('user').id
        const user = interaction.guild.members.cache.get(userId)
        user.roles.add(config.customerRole)
        const embed = new EmbedBuilder()
        .setTitle('קבלת קנייה')
        .addFields(
            { name: 'שם הלקוח:', value: `${interaction.options.getString('name')}`},
            { name: 'הדיסקורד של הלקוח:', value: `${user} | (${userId})`},
            { name: 'סכום הרכישה:', value: `${interaction.options.getString('amount')}`},
            { name: 'פרטי הרכישה:', value: `${interaction.options.getString('details')}`},
            { name: 'תאריך רכישה:', value: `${interaction.options.getString('date')}`}
        )
        if(interaction.options.getString('notes')) {
            embed.addFields({ name: 'הערות:', value: `${interaction.options.getString('notes')}`})
        }
        embed.setTimestamp()
        .setColor('#03fcdb')
        try {
        	user.send({ embeds: [embed]}).catch(err => {
            	console.log('test')
            	return interaction.reply(`**> Could not send a DM message to this user.**`)
        	})    
        } catch (err) {
            interaction.reply({ content: `**> A receipt successfully sent to ${user} !**` })
        }
        client.guilds.cache.get(config.serverId).channels.cache.get(config.receiptsChannel).send({ embeds: [embed]})
        
    }
}