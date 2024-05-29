const { Interaction } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if(!interaction.guild) return;
        if(interaction.guild.id !== config.serverId) return;
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
        try{


            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });
        } 

    },
    


};