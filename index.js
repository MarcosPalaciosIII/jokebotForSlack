require("dotenv").config();
const SlackBot = require('slackbots');
const axios = require('axios');


const bot = new SlackBot({
  token: `${process.env.SLACK_TOKEN}`,
  name: 'jokebot',
});


// Start Handlers
bot.on('start', () => {
  const params = {
    icon_emoji: ':smiley:'
  };

  bot.postMessageToChannel(
    'test',
    'Hello everyone, @JokeBot is active!',
    params
  );
});


// Error Event
bot.on('error', (err) => console.log(err));


// Message Handler
bot.on('message', async (data) => {

  let channelsArray = await axios.get(`ttps://slack.com/api/conversations.list?token=${process.env.SLACK_TOKEN}`)
  if(data.type !== 'message') return;

  let theChannel = channelsArray.data.channels.filter(oneChannel => oneChannel.id === data.channel);
  // console.log("the data >>>>>>>>>>>>>>>> ", data, " ------------------ ", channelsArray.data.channels, " ============== ", theChannel[0].name);

  handleMessage(data.text, theChannel[0].name);
});

let handleMessage = (message, theChannel) => {

  if(message.toLowerCase().includes(' help')) {
    runHelp(theChannel);
  } else if(message.toLowerCase().includes(' chucknorris joke') || message.toLowerCase().includes(' chuck norris joke')) {
    chuckJoke(theChannel);
  } else if(message.toLowerCase().includes(' dad joke') || message.toLowerCase().includes(' dadjoke')) {
    randomJoke(theChannel);
  } else if(message.toLowerCase().includes(' lets play')) {
    gameOptions(sendToChannel)
  }
};


// Show Help Text
let runHelp = (sendToChannel) => {
  const params = {
    icon_emoji: ':question:'
  };

  bot.postMessageToChannel(
    `${sendToChannel}`,
    `Type @JokeBot with 'chuck norris joke' or 'dad joke'`,
    params
  );
}


let gameOptions = (sendToChannel) => {
  const params = {
    icon_emoji: ':thinking_face:'
  }
  bot.postMessageToChannel({
    'channel': `${sendToChannel}`,
    "text": "Would you like to play a game?",
    "attachments": [
        {
            "text": "Choose a game to play",
            "fallback": "You are unable to choose a game",
            "callback_id": "wopr_game",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "game",
                    "text": "Chess",
                    "type": "button",
                    "value": "chess"
                },
                {
                    "name": "game",
                    "text": "Falken's Maze",
                    "type": "button",
                    "value": "maze"
                },
                {
                    "name": "game",
                    "text": "Thermonuclear War",
                    "style": "danger",
                    "type": "button",
                    "value": "war",
                    "confirm": {
                        "title": "Are you sure?",
                        "text": "Wouldn't you prefer a good game of chess?",
                        "ok_text": "Yes",
                        "dismiss_text": "No"
                    }
                }
            ]
        }
    ],
    params
})
}


// Tell a Chuck Norris Joke
let chuckJoke = async (sendToChannel)=>{
  try {
    let msg = await axios.get('http://api.icndb.com/jokes/random');

    // console.log("============== ", msg);
    const params = {
      icon_emoji: ':laughing:'
    };

    bot.postMessageToChannel(
      `${sendToChannel}`,
      `${msg.data.value.joke}`,
      params
    );
  } catch(err) {
    console.log("error getting Chuck Joke ------ ", err);
  }

};


// Tell a Random Joke
let randomJoke = async (sendToChannel) => {
  try {
    let msg = await axios.get("https://icanhazdadjoke.com/slack")
    const params = {
      icon_emoji: ':laughing:'
    };
    console.log("the dad joke >>>>>>> ", msg.data.attachments[0].fallback);
    bot.postMessageToChannel(
      `${sendToChannel}`,
      `${msg.data.attachments[0].text}`,
      params
    );
  } catch(err) {
    console.log("error getting Random Joke ------- ", err);
  }
}
