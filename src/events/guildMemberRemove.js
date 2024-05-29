const { ActivityType, EmbedBuilder } = require('discord.js');
const config = require('../../config.json')
module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        const guild = client.guilds.cache.get(config.serverId)
        client.user.setActivity(`${guild.memberCount} Members!`, { type: ActivityType.Watching})
    },
};