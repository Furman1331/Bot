const Discord = require('discord.js');
const request = require('request');

const config = require('./config.json');
const prefix = config.prefix || "!";

const client = new Discord.Client({
    disableEveryone: true,
    MESSAGE: true,
    CHANNEL: true,
})

client.on('ready', async () => {
    console.log(`Pomyślnie uruchomiono bota ${config.name}!`);
    await client.user.setActivity('!help © CentrumRP Bot - Niedługo Start', {type: "WATCHING"});
});

client.on('message', async message => {
    const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;

    if(regex.exec(message.content)) {
        await message.author.send(`${message.author}, Nie masz uprawnien do wysyłania linków!`).then(message.delete()).catch(console.error);
    };

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        message.author.send(`Dostępne komedy: \`\`\`!help - Dostępne komendy\n!faq - Najczęściej zadawane pytania.\`\`\``).then(message => setTimeout(() => {message.delete();}, config.timeToDelete));
    }
    else if (command === 'faq'){
        message.author.send(`Dlaczego serwer jest OFF ? - Obecnie trwają prace techniczne.`).then(messages => setTimeout(() => {message.delete();}, config.timeToDelete));
    }
    else if(command === 'clear') {
        if(message.member.hasPermission("MANAGE_MESSAGES")) {
            const amount = parseInt(args[0]);
            if(!args.length) {
                return message.channel.send(`Nie podano ilości, ${message.author}!`).then(messages => setTimeout(() => { messages.delete(); message.delete()}, config.timeToDelete));
            }
            else if(!isNaN(amount)) {
                message.channel.bulkDelete(amount + 1).catch(error => console.log(error.stack)).then(messages => console.log(`Wyczyszczono wiadomości na kanale ${message.channel.name}, ilość : ${amount} !`)).catch(console.error);
                return message.channel.send(`Pomyślnie usunięto wiadomości, ${message.author}!`).then(messages => setTimeout(() => { messages.delete()}, config.timeToDelete));
            }
            else {
                return message.channel.send(`Argument musi być liczbą, ${message.author}!`).then(messages => setTimeout(() => { messages.delete(), message.delete()}, config.timeToDelete));
            }
        }
    }
    else if (command === 'wl-losuj') {
        if(message.member.hasPermission("ADMINISTRATOR") || (message.guild.roles.cache.find(role => role.name === "Whitelist Checker"))) {
            const whitelistCheckerChannel = message.member.voice.channel
            client.channels.fetch(config.waitingRoom).then(channel => {
                const randomUser = channel.members.random();
                if (!randomUser) return message.channel.send(`Obecnie nie ma osób w kolejce, ${message.author}.`).then(messages =>ClearMessagesAfterTime([message, messages], config.timeToDelete));
                return message.channel.send(`Do zdania Whitelisty wylosowano, ${randomUser}`).then(randomUser.voice.setChannel(whitelistCheckerChannel));
            })
        }
    }
    else if (command === 'wl-zdal') {
        if(message.member.hasPermission("ADMINISTRATOR") || (message.guild.roles.cache.find(role => role.name === "Whitelist Checker"))) {
            const user = message.mentions.users.first();
            if(!user) return message.channel.send(`Nie ma takiego użytkownika, ${message.author}!`).then(messages => ClearMessagesAfterTime([message, messages], config.timeToDelete));

            let filter = m => m.author.id === message.author.id
            message.channel.send(`Czy napewno nadać white liste dla ${user.username}, \'tak\' / \'nie\'`).then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(message => {
                    message = message.first()
                    if (message.content.toUpperCase() == 'TAK' || message.content.toUpperCase() == 'YES') {
                        const target = message.guild.members.cache.get(user.id)
                        target.roles.add(config.whitelistRole)
                        return message.channel.send(`Nadano whiteliste dla obywatela, ${message.author}.`).then(messages => ClearMessagesAfterTime([message, messages], config.timeToDelete));
                    } else if (message.content.toUpperCase() == 'NIE' || message.content.toUpperCase() == 'NO') {
                        return message.channel.send(`Zrezygnowano, ${message.author}.`).then(messages => ClearMessagesAfterTime([message, messages], config.timeToDelete));
                    } else {
                        return message.channel.send(`Błąd podczas wpisywania, ${message.author}.`).then(messages => ClearMessagesAfterTime([message, messages], config.timeToDelete));
                    }
                }).catch(collected => {
                    message.channel.send(`ERROR: ${collected}`);
                });
            })
        }
    }
});

function getUserFromMark(user) {
    if(!user) return;

    if(user.startsWith('<@') && user.endsWith('>')) {
        user = user.slice(2, -1);

        if(user.startsWith('!')) {
            user = user.slice(1);
        }

        return client.users.cache.get(user);
    }
}

function ClearMessagesAfterTime(array, time) {
    setTimeout(() =>
        array.forEach(element => {
            element.delete();
        }),
    time)
}

client.setInterval(async () => {
    if(config.fivem_info_url == null || config.fivem_players_url == null || config.count_member_channelId == null) return;
    client.channels.fetch(config.count_member_channelId).then(channel =>{
        request(config.fivem_info_url, function(err, response, fivemInfo) {
            request(config.fivem_players_url, function(err1, response1, fivemPlayers){
                if (response == undefined || response1 == undefined) {
                    channel.setName(`Paros: OFFLINE`);
                    return
                }
                if (err || err1) {
                    channel.setName(`Paros: OFFLINE`);
                    console.log(`[Error] while refresh server Info.`)
                    return
                } else {
                    var info = JSON.parse(fivemInfo);
                    var players = JSON.parse(fivemPlayers);
                    client.user.setActivity(`CentrumRP [${players.length}/${info.vars.sv_maxClients}] - !help © CentrumRP Bot`, {type: 'WATCHING'});
                    channel.setName(`dev.centrumrp.eu: ${players.length}/${info.vars.sv_maxClients}`);
                }
            });
        });
    }).catch(error => {
        console.log(`[Error] Cannot find channel!`)
    });
}, 30 * 1000);

client.login(config.token);