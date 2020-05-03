require('dotenv').config() // Required to use dotenv constants
const BotkitDiscord = require('botkit-discord');
const https = require('https');

const config = {
    token: process.env.BOT_TOKEN, // Discord bot token
}

const discordBot = BotkitDiscord(config);
const botId = process.env.BOT_ID; // Bot ID
 
discordBot.hears('hello','ambient', (bot, message) => {
    // TODO: Get bot ID dynamically
    if(message.user.id !== botId){
        bot.reply(message, 'hello world!');
    }
});

discordBot.hears(new RegExp(/weather in (\w+)/g), 'mention', (bot, message) => {
    let city_regex = new RegExp(/weather in (\w+)/g);
    
    let matched = city_regex.exec(message.raw_message.content);
    let city_name = matched[1];

    let search_url = 'https://www.metaweather.com/api/location/search/?query=' + city_name;
    
    https.get(search_url, function(res){
        let body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            if(message.user.id !== botId){
                let search_responce = JSON.parse(body);

                if(search_responce.length == 0) {
                    bot.reply(message, 'Sorry! I couldn\'t find the weather for that location');
                    return;
                }

                let city_code = search_responce[0].woeid;
                
                let weather_url = 'https://www.metaweather.com/api/location/' + city_code + '/';

                https.get(weather_url, function(res){
                    let body = '';

                    res.on('data', function(chunk){
                        body += chunk;
                    });

                    res.on('end', function(){
                        let weather_response = JSON.parse(body);

                        let first_source = weather_response.consolidated_weather[0];
                        
                        let weather_state_name = first_source.weather_state_name;
                        let weather_state_abbr = first_source.weather_state_abbr;

                        let reply = {
                            text: 'The current weather in **' + weather_response.title + '** is: ' + weather_state_name,
                            files: [
                                {
                                    attachment: 'https://www.metaweather.com/static/img/weather/png/64/' + weather_state_abbr + '.png',
                                    name: 'weather.png'
                                }
                            ]
                        }

                        bot.reply(message, reply);
                    });
                }).on('error', function(e){
                    bot.reply(message, 'Sorry! Something went wrong...');
                    console.log("Got an error: ", e);
                });
            }
        });
    }).on('error', function(e){
        bot.reply(message, 'Sorry! Something went wrong...');
        console.log("Got an error: ", e);
    });
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