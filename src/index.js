const {  ButtonBuilder, ActionRowBuilder , Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Collection, Events, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans] }); 
const config = require('../config.json')
const ticket = require('../ticket.json')

const discordTranscripts = require('discord-html-transcripts');

client.commands = new Collection();

require('dotenv').config();
const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)  
})();


client.on(Events.MessageCreate, async message => {
    if(!message.guild) return;
    if(message.guild.id !== config.serverId) return;

    if(message.content === "!verify") {
        if(!message.member.permissions.has('Administrator')) return
        const embed = new EmbedBuilder()
        .setTitle("Verify System")
        .setDescription(`**In order to get the <@&${config.memberId}>, press the button below**`)
        .setColor('Green')
        .setAuthor({ name: "Ped Shop", iconURL: "https://cdn.discordapp.com/attachments/1104476861305737227/1195752083710812371/image.png?ex=65b521e8&is=65a2ace8&hm=c5d74ac518f9385c688a2502cf4fe2e508ce3d5aa1044b618e36e4b5c06a9f36&"})
        .setFooter({ text: "Developed By Gavish", iconURL: "https://cdn.discordapp.com/attachments/1104476861305737227/1195752083710812371/image.png?ex=65b521e8&is=65a2ace8&hm=c5d74ac518f9385c688a2502cf4fe2e508ce3d5aa1044b618e36e4b5c06a9f36&"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("verify")
            .setEmoji('901093240923631716')
            .setStyle(ButtonStyle.Success)
        )
        message.channel.send({ embeds: [embed], components: [button]})
    }

    if(message.content.toLowerCase().startsWith("!say ")) {
        if(!message.member.permissions.has('Administrator')) return
        console.log(message.content)
        const args = message.content.split(/\s+/)
        const commandName2 = args.shift().substring(1)
        const msg = args.join(' ')
        message.channel.send(msg)
    }

    if(message.content.toLowerCase().startsWith("!sug ")) {
        message.delete()
        if(!message.member.permissions.has('Administrator')) {
            if(message.channel.id !== config.commandsChannelId) {
                return message.reply(`> Command can use only here: <#${config.commandsChannelId}>`)
            }
        }
        const args = message.content.split(/\s+/)
        const commandName2 = args.shift().substring(1)
        const sug = args.join(' ')
        const embed = new EmbedBuilder()
        .setTitle("Suggestions System")
        .setColor("#000000")
        .setDescription(`${sug} \n\n (${message.member})`)
        .setFooter({ text: "Developed By Gavish"})
        client.guilds.cache.get(config.serverId).channels.cache.get(config.sugChannelId).send({ embeds: [embed] }).then(msg => {
            msg.react('✅')
            msg.react('❌')
        })
    }

    if(message.content === "!ticketE") {
        if(!message.member.permissions.has('Administrator')) return
        const embed = new EmbedBuilder()
        .setColor('#349eeb')
        .setTitle("Ticket System")
        .setDescription("In order to open a ticket, click the button below")
        .setFooter({ text: "Developed By Gavish "})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setEmoji('🎫')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('ticket')
        )
        message.channel.send({ embeds: [embed], components: [button] })
    }
    
    if(message.content.toLowerCase() === "?cc") {
        if(!message.member.permissions.has('Administrator')) return
        if(message.channel.parent.id !== config.supportParent && message.channel.parent.id !== config.purchaseParent ) return;
        const attachment = await discordTranscripts.createTranscript(message.channel)
        
        const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription("> **The ticket will be deleted in 5 seconds**")
        setTimeout(() => {
            message.channel.send({ embeds: [embed]})
        }, 1000)
        setTimeout(() => {
            message.channel.delete()
        }, 5000)

        let target = ""

        Object.keys(ticket).forEach(key => {
            if(ticket[key].channel === message.channel.id) {
                ticket[key] = {
                    isOpen: false,
                    channel: 0
                }
                target = key
            }
        })
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })

        const embed2 = new EmbedBuilder()
        .setColor('Blue')
        .setFooter({ text: "Developed By Gavish"})
        .setTitle('Ticket Transcript')
        .addFields(
            { name: "Ticket Owner:", value: `<@${target}>`, inline: true },
            { name: 'Ticket Closer:', value: `${message.member}`}
        )
        message.guild.channels.cache.get(config.ticketLogs).send({ embeds: [embed2], files: [attachment] })
        
        
    }

    if(message.content.toLowerCase() === "?purchase") {
        if(!message.member.permissions.has('Administrator')) return message.reply("**> אין לך גישה להשתמש בפקודה זו**")
        if(message.channel.parent.id !== config.supportParent && message.channel.parent.id !== config.purchaseParent ) return;
        message.channel.setParent(config.crazyParent)
        const currentPermissionOverwrites = message.channel.permissionOverwrites.cache.map(
            (overwrite) => {
                return {
                    id: overwrite.id,
                    allow: overwrite.allow.bitfield,
                    deny: overwrite.deny.bitfield,
                    type: overwrite.type,
                };
            }
        );
        currentPermissionOverwrites.forEach((overwrite) => {
            const { id, allow, deny, type } = overwrite;
            const target = message.channel.guild.roles.cache.get(id) || id;
            message.channel.permissionOverwrites.edit(id, { ALLOW: allow, DENY: deny, type: type });
        });  
        message.reply("**> הקטגוריה של הטיקט שונתה בהצלחה לקטגורית __קנייה__ !**")
    }

    if(message.content.toLowerCase() === "?support") {
        if(message.channel.parent.id !== config.supportParent && message.channel.parent.id !== config.purchaseParent ) return;
        if(!message.member.permissions.has('Administrator')) return message.reply("**> אין לך גישה להשתמש בפקודה זו**")
        message.channel.setParent(config.legalParent)
        const currentPermissionOverwrites = message.channel.permissionOverwrites.cache.map(
            (overwrite) => {
                return {
                    id: overwrite.id,
                    allow: overwrite.allow.bitfield,
                    deny: overwrite.deny.bitfield,
                    type: overwrite.type,
                };
            }
        );
        currentPermissionOverwrites.forEach((overwrite) => {
            const { id, allow, deny, type } = overwrite;
            const target = message.channel.guild.roles.cache.get(id) || id;
            message.channel.permissionOverwrites.edit(id, { ALLOW: allow, DENY: deny, type: type });
        });

        message.reply("**> הקטגוריה של הטיקט שונתה בהצלחה לקטגורית __תמיכה__ !**")
    }

    if(message.content.toLowerCase() === "?em") {
        message.delete()
        if(!message.member.permissions.has('Administrator')) return

        const embed = new EmbedBuilder()
        .setTitle("PACK 1 PED CUSTOM")
        .setDescription("פד בעיצוב אישי (Custom Ped)\n3 חולצות\n3 מכנסיים\n3 נעליים\n3 שיער\n 2 מסיכות\n1ווסט\n1 משקפיים")
        .setFields(
            { name: "price:", value: "25$" }
        )
        .setColor("Green")
        message.channel.send({ embeds: [embed] })
    }

})

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.guild) return;
    if(interaction.guild.id !== config.serverId) return;
    //-------------------------------------------------verify------------------------------------------------------
    if(interaction.customId === "verify") {
        const vRole = interaction.guild.roles.cache.get(config.memberId)
        interaction.member.roles.add(vRole)
        interaction.reply({ content: "**> ביצעת את האימות בהצלחה**", ephemeral: true })
    }

    //-------------------------------------------------end of verify------------------------------------------------
    
    

    if(interaction.customId === "ticket") {
        if(interaction.member.roles.cache.find(role => role.id === config.ticketBlockRoleId)) {
            return interaction.reply({ content: "**> אתה חסום מפתיחת טיקטים**", ephemeral: true})
        }
        if(ticket[interaction.member.id] !== undefined) {
            if(ticket[interaction.member.id].channel !== 0) {
                const ch = interaction.guild.channels.cache.find(ticket[interaction.member.id].channel)
                if(!ch) {
                    ticket[interaction.member.id] = {
                        isOpen: false,
                        channel: 0
                    }
                    fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
                        if(err) console.log(err)
                    })
                }
                else {
                    return interaction.reply({ content: `**> יש לך כבר טיקט פתוח \n <#${ticket[interaction.member.id].channel}> **`, ephemeral: true})
                }
            }
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId('ticketOption')
            .setPlaceholder('Ticket Options')
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(
                new StringSelectMenuOptionBuilder({
                    label: 'תמיכה',
                    value: 'support'
                }), 
                new StringSelectMenuOptionBuilder({
                    label: 'קנייה',
                    value: 'purchase'
                })
            )
        await interaction.reply({ components: [new ActionRowBuilder().addComponents(menu)], ephemeral: true})

    }

    if(interaction.customId === "closeTicket") {
        if(!interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole) && !interaction.member.permissions.has('Administrator')) {
            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('close')
                .setStyle('Danger')
                .setEmoji('🗑')
            )
            return interaction.reply({ content: `${interaction.user.tag} מבקש לסגור את הטיקט`, components: [button] })
        }
        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('close')
            .setStyle('Danger')
            .setEmoji('🗑'),
            new ButtonBuilder()
            .setCustomId('cancel')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Cancel')
        )
        const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription("האם אתה בטוח שאתה רוצה לסגור את הטיקט?")
        interaction.reply({ embeds: [embed], components: [buttons]})
    }

    if(interaction.customId === "cancel") {
        if(!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: "**> אתה לא חבר צוות**", ephemeral: true })
        }
        interaction.message.delete()
    }

    if(interaction.customId === "close") {
        if(!interaction.member.permissions.has('Administrator') && !interaction.member.roles.cache.find(role => role.id === config.staffRole) && !interaction.member.roles.cache.find(role => role.id === config.headStaffRole) && !interaction.member.roles.cache.find(role => role.id === config.managementRole)) {
            return interaction.reply({ content: "**> אתה לא חבר צוות**", ephemeral: true })
        }
        setTimeout(() => {
            interaction.message.delete()
        }, 2000)    
        const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription("> **הטיקט ייסגר בעוד מספר שניות**")
        interaction.deferReply()
        setTimeout(() => {
            interaction.editReply({ embeds: [embed]})
        }, 1000)
        setTimeout(() => {
            interaction.channel.delete()
        }, 5000)
        let target = ""
        Object.keys(ticket).forEach(key => {
            if(ticket[key].channel === interaction.channel.id) {
                ticket[key] = {
                    isOpen: false,
                    channel: 0
                }
                target = key
            }
        })
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })
        const attachment = await discordTranscripts.createTranscript(interaction.channel)

        const embed2 = new EmbedBuilder()
        .setColor('Blue')
        .setFooter({ text: "Developed By Gavish"})
        .setTitle('Ticket Transcript')
        .addFields(
            { name: "Ticket Owner:", value: `<@${target}>`, inline: true },
            { name: 'Ticket Closer:', value: `${interaction.member}`}
        )
        interaction.guild.channels.cache.get(config.ticketLogs).send({ embeds: [embed2], files: [attachment] })
    }
})

//-----------------------------------------------------------------Tickets-----------------------------
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.guild) return;
    if(!interaction.isAnySelectMenu()) return;
    if(interaction.guild.id !== config.serverId) return;

    if(interaction.values[0] === "support") {
        if(ticket[interaction.member.id] !== undefined && ticket[interaction.member.id].isOpen) return interaction.reply({ content: `You already have a ticket \n <#${ticket[interaction.member.id].channel}>`, ephemeral: true})
        const modal = new ModalBuilder()
        .setCustomId('supportModal')
        .setTitle('תמיכה')
        const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('שם')
        .setStyle(TextInputStyle.Short)
        const title = new TextInputBuilder()
        .setCustomId('title')
        .setLabel('נושא השאלה')
        .setStyle(TextInputStyle.Short)
        const description = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('הסבר')
        .setStyle(TextInputStyle.Paragraph)

        const nameRow = new ActionRowBuilder().addComponents(name)
        const titleRow = new ActionRowBuilder().addComponents(title)
        const descriptionRow = new ActionRowBuilder().addComponents(description)
        modal.addComponents(nameRow, titleRow, descriptionRow);
        await interaction.showModal(modal);
    }

    if(interaction.values[0] === "purchase") {
        if(ticket[interaction.member.id] !== undefined && ticket[interaction.member.id].isOpen) return interaction.reply({ content: `You already have a ticket \n <#${ticket[interaction.member.id].channel}>`, ephemeral: true})
        const modal = new ModalBuilder()
        .setCustomId('purchaseModal')
        .setTitle('תרומה')
        const name2 = new TextInputBuilder()
        .setCustomId('name2')
        .setLabel('שם')
        .setStyle(TextInputStyle.Short)
        const details = new TextInputBuilder()
        .setCustomId('details')
        .setLabel('מה תרצה לקנות?')
        .setStyle(TextInputStyle.Short)

        const nameRow = new ActionRowBuilder().addComponents(name2)
        const detailsRow = new ActionRowBuilder().addComponents(details)
        modal.addComponents(nameRow, detailsRow);
        await interaction.showModal(modal);
    }

})

//Modal Submit Event
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isModalSubmit()) return;
    if(interaction.guild.id !== config.serverId) return;

    if(interaction.customId === "supportModal") {
        const channel = await interaction.guild.channels.create({
            name: `${interaction.user.username}-ticket`,
            type: ChannelType.GuildText,
            parent: config.supportParent,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })
        const embed = new EmbedBuilder()
        .setTitle('Ped Shop | Ticket System')
        .setTimestamp()
        .setColor('#03a5fc')
        .setDescription(`**שם:** ${interaction.fields.getTextInputValue('name')}\n\n **נושא השאלה:** ${interaction.fields.getTextInputValue('title')}\n\nהסבר: ${interaction.fields.getTextInputValue('description')} \n\n\n**בבקשה תמתין בסבלנות למענה הצוות**\nקטגוריה: תמיכה`)
        .setFooter({ text: "Developed By Gavish"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑')
            .setCustomId('closeTicket')
        )
        channel.send({ content: `<@&1195754238672896021> | ${interaction.member}`, embeds: [embed], components: [button]})
        interaction.reply({ content: `**> הטיקט שלך נוצר בהצלחה!**\n**> ${channel}**`, ephemeral: true })
       
        ticket[interaction.member.id] = {
            isOpen: true,
            channel: channel.id
        }
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })
    }

    if(interaction.customId === "purchaseModal") {
        const channel = await interaction.guild.channels.create({
            name: `${interaction.user.username}-ticket`,
            type: ChannelType.GuildText,
            parent: config.purchaseParent,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })
        const embed = new EmbedBuilder()
        .setTitle('Ped Shop | Ticket System')
        .setTimestamp()
        .setColor('#03a5fc')
        .setDescription(`**שם:** ${interaction.fields.getTextInputValue('name2')} \n \n **מה תרצה לקנות?:** ${interaction.fields.getTextInputValue('details')} \n\n\n**בבקשה תמתין בסבלנות למענה הצוות**\nקטגוריה: קנייה`)
        .setFooter({ text: "Developed By Gavish"})
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑')
            .setCustomId('closeTicket')
        )
        channel.send({ content: `<@&1195754238672896021> | ${interaction.member}`, embeds: [embed], components: [button]})
        interaction.reply({ content: `Your ticket has been successfully created! \n ${channel}`, ephemeral: true })
       
        ticket[interaction.member.id] = {
            isOpen: true,
            channel: channel.id
        }
        fs.writeFile('./ticket.json', JSON.stringify(ticket), (err) => {
            if(err) console.log(err)
        })
    }
})

//--------------------------------------------------------------End Of Tickets-----------------------------
//Boost
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    if(newMember.guild.id !== config.serverId) return;
    const hadRole = oldMember.roles.cache.find(role => role.id === "1121869823614402571")
    const hasRole = newMember.roles.cache.find(role => role.id === "1121869823614402571")

    if(!hadRole && hasRole) {
        const embed = new EmbedBuilder()
        .setDescription(`Thanks for the boost ${newMember} !`)
        .setColor("#f47fff")
        client.guilds.cache.get(config.serverId).channels.cache.get(config.boostsChannelId).send({ embeds: [embed] })
    }
})
