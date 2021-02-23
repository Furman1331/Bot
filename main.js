const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json')

client.on('ready', () => {
    console.log(`Pomyślnie uruchomiono bota ${settings.name}!`);
    client.user.setActivity('!help © CentrumPack', {type: "WATCHING"}).then(presence => console.log(`Pomyślnie ustawiono aktywność dla bota ${settings.name}!`)).catch(console.error);
});

client.on('message', async message => {
    const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;

    if(regex.exec(message.content)) {
        await message.author.send(`${message.author}, Nie masz uprawnien do wysyłania linków!`).then(message.delete()).catch(console.error);
    };

    if(!message.content.startsWith(settings.prefix) || message.author.bot) return;

    const args = message.content.slice(settings.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        message.author.send(`Dostępne komedy : !help - Dostępne komendy `).then(messages => setTimeout(() => { message.delete()}, 4000));
    }
    else if(command === 'clear') {
        if(message.member.hasPermission("MANAGE_MESSAGES")) {
            const amount = parseInt(args[0]);
            if(!args.length) {
                return message.channel.send(`Nie podano ilości, ${message.author}!`).then(messages => setTimeout(() => { messages.delete(); message.delete()}, 4000));
            } 
            else if(!isNaN(amount)) {
                message.channel.bulkDelete(amount + 1).catch(error => console.log(error.stack)).then(messages => console.log(`Wyczyszczono wiadomości na kanale ${message.channel.name}, ilość : ${amount} !`)).catch(console.error);
                message.channel.send(`Pomyślnie usunięto wiadomości, ${message.author}!`).then(messages => setTimeout(() => { messages.delete()}, 4000));
            } 
            else {
                return message.channel.send(`Argument musi być liczbą, ${message.author}!`).then(messages => setTimeout(() => { messages.delete(), message.delete()}, 4000));
            }
        }
    } 
});

client.login(settings.tokentotest);