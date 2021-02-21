const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json')

client.on('ready', () => {
    console.log(`Pomyślnie uruchomiono bota ${settings.name}!`);
    client.user.setActivity('!help © CentrumPack', {type: "WATCHING"}).then(presence => console.log(`Pomyślnie ustawiono aktywność dla bota ${settings.name}!`)).catch(console.error);
});

client.on('message', function(message) {
    if(!message.content.startsWith(settings.prefix) || message.author.bot) return;

    const args = message.content.slice(settings.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        message.channel.send(`Witam w czym mogę pomóc ?`)
    }
    else if(command === 'clear') {
        if(message.member.hasPermission("MANAGE_MESSAGES")) {
            const amount = parseInt(args[0]);
            if(!args.length) {
                return message.channel.send(`Nie podano ilości, ${message.author}!`).then(messages => setTimeout(() => { message.channel.bulkDelete(1)}, 4000));
            } 
            else if(!isNaN(amount)) {
                message.channel.bulkDelete(amount + 1).catch(error => console.log(error.stack)).then(messages => console.log(`Wyczyszczono wiadomości na kanale ${message.channel.name}, ilość : ${amount} !`)).catch(console.error);
                message.channel.send(`Pomyślnie usunięto wiadomości, ${message.author}!`).then(messages => setTimeout(() => { message.channel.bulkDelete(1)}, 4000));
            } 
            else {
                return message.channel.send(`Argument musi być liczbą, ${message.author}!`).then(messages => setTimeout(() => { message.channel.bulkDelete(1)}, 4000));
            }
        }
    } 
});

client.login(settings.token);