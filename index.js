require('dotenv').config() // Required to use dotenv constants
const BotkitDiscord = require('botkit-discord');
const config = {
    token: process.env.BOT_TOKEN, // Discord bot token
}

const discordBot = BotkitDiscord(config);
 
discordBot.hears('hello','ambient', (bot, message) => {
    // TODO: Get bot ID dynamically
    if(message.user.id !== 'bot id'){
        bot.reply(message, 'hello world!');
    } 
    
});

discordBot.hears('.*', 'mention', (bot, message) => {
    if(message.user.id !== '706170931852345439'){
        const leaveMeAlonePhrases = [
            'Leave me to be please.',
            'Please leave be alone!',
            'Don\'t you have anything better to do?',
            'Go do something else',
            'Disturb someone else',
            'Can\'t you write to someone else?',
            'How do I turn off the notifications? this is getting annoying.',
            'Shut up!',
        ];

        let randomIndex = Math.floor(Math.random() * (leaveMeAlonePhrases.length - 1)); 

        bot.reply(message, leaveMeAlonePhrases[randomIndex]);
    } 
});