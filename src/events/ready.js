const { ActivityType, EmbedBuilder, Embed } = require('discord.js');
const config = require('../../config.json')
const axios = require('axios');
const fs = require('fs')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');
        const guild = client.guilds.cache.get(config.serverId)
        let temp = 0;

        async function activity() {
            if(temp === 0) {
                client.user.setActivity(`${guild.memberCount} Members!`, { type: ActivityType.Watching})
                temp = 1
            }
            else {
                await guild.members.fetch().catch(err => {
                    console.log(err)
                })
                const role = guild.roles.cache.get(config.customerRole)
                let Customers = role.members.size
                client.user.setActivity(`${Customers} Customers!`, { type: ActivityType.Watching})
                
                temp = 0
            }
        }
        setInterval(() => {
            activity()
            
        }, 8000)
        
    }
};

