const { ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config.json')
module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        if(member.guild.id !== config.serverId) return;
        const guild = client.guilds.cache.get(config.serverId)
        client.user.setActivity(`${guild.memberCount} Members!`, { type: ActivityType.Watching})
        const welcomeMessage = new EmbedBuilder()
        .setTitle("Welcome 👋")
        .setAuthor({ name: "NB - V", iconURL: "https://cdn.discordapp.com/attachments/1182324173293502595/1182329965165944915/images.png?ex=65844d96&is=6571d896&hm=d255db8719132b9b56bf52d0a1df47182805bd42d21aadd73297105dbba41fba&" })
        .setTimestamp()
        .setColor("#1291cc")
        .setDescription(`**Welcome ${member} to \`NB - V\`**`)
        .setFooter({ text: "Developed By Gavish", iconURL: "https://cdn.discordapp.com/attachments/1182324173293502595/1182329965165944915/images.png?ex=65844d96&is=6571d896&hm=d255db8719132b9b56bf52d0a1df47182805bd42d21aadd73297105dbba41fba&" })
        .setThumbnail(member.user.displayAvatarURL())
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("members")
            .setStyle(ButtonStyle.Primary)
            .setLabel(`${guild.memberCount} Members!`)
            .setDisabled()
        )
        guild.channels.cache.get(config.welcomeChannel).send({ embeds: [welcomeMessage], components: [button]})
    },
};