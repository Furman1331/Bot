const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const prefix = settings.prefix || "!";

const Mysql = require('mysql');


let roleName = "";

client.on('ready', async () => {
    console.log(`Pomyślnie uruchomiono bota ${settings.name}!`);
    await client.user.setActivity('!help © FurmanBot', {type: "WATCHING"}).then(presence => console.log(`Pomyślnie ustawiono aktywność dla bota ${settings.name}!`)).catch(console.error);
    roleName = client.guilds.get(guild_id).roles.get(verified_role_id).name;
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
        message.author.send(`Dostępne komedy: \`\`\`!help - Dostępne komendy\n!faq - Najczęściej zadawane pytania.\`\`\``).then(message => setTimeout(() => {message.delete();}, 4000));
    }
    else if (command === 'faq'){
        message.author.send(`Obecnie nie dostępne`).then(messages => setTimeout(() => {messages.delete();}, 4000));
    }
    else if(command === 'clear') {
        if(message.member.hasPermission("MANAGE_MESSAGES")) {
            const amount = parseInt(args[0]);
            if(!args.length) {
                return message.channel.send(`Nie podano ilości, ${message.author}!`).then(messages => setTimeout(() => { messages.delete(); message.delete()}, 4000));
            }
            else if(!isNaN(amount)) {
                message.channel.bulkDelete(amount + 1).catch(error => console.log(error.stack)).then(messages => console.log(`Wyczyszczono wiadomości na kanale ${message.channel.name}, ilość : ${amount} !`)).catch(console.error);
                return message.channel.send(`Pomyślnie usunięto wiadomości, ${message.author}!`).then(messages => setTimeout(() => { messages.delete()}, 4000));
            }
            else {
                return message.channel.send(`Argument musi być liczbą, ${message.author}!`).then(messages => setTimeout(() => { messages.delete(), message.delete()}, 4000));
            }
        }
    }
    else if(command === 'warn') {
        if(message.member.hasPermission("ADMINISTRATOR") || (message.guild.roles.cache.find(role => role.name === "Community Manager" || role.name === "Owner" || role.name === "Admin"))) {
            const user = getUserFromMention(args[0]);
            if(!user) {
                return message.channel.send(`Nie ma takiego użytkownika, ${message.author}!`).then(messages => setTimeout(() => { messages.delete(), message.delete()}, 4000));
            }

            console.log(` User ${user.id}`)
        }
    }
});

function getUserFromMention(mention) {
    if(!mention) return;

    if(mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if(mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.users.cache.get(mention);
    }
}

client.login(settings.token);