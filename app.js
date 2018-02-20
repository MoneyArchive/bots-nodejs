// This loads the environment variables from the .env file
require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');

var cards = require("./cards");

var telemetryModule = require('./telemetry-module.js');
var appInsights = require('applicationinsights');
appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATION_KEY).start();
var appInsightsClient = new appInsights.TelemetryClient();

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    var msg;

    switch (session.message.text) {
        case "HeroCard":
            var card = cards.createHeroCard(session);
            msg = new builder.Message(session).text("連卡帶字範例").addAttachment(card);
            break;
        case "ThumbnailCard":
            var card = cards.createThumbnailCard(session);
            msg = new builder.Message(session).addAttachment(card);
            break;
        case "ReceiptCard":
            var card = cards.createReceiptCard(session);
            msg = new builder.Message(session).addAttachment(card);
            break;
        case "SigninCard":
            var card = cards.createSigninCard(session);
            msg = new builder.Message(session).addAttachment(card);
            break;
        case "AnimationCard":
            var card = cards.createAnimationCard(session);
            msg = new builder.Message(session).addAttachment(card);
            break;
        case "VideoCard":
            var card = cards.createVideoCard(session);
            msg = new builder.Message(session).addAttachment(card);
            break;
        case "AudioCard":
            var card = cards.createAudioCard(session);
            msg = new builder.Message(session).addAttachment(card);
            break;
        case "CarouselCard":
            var card = cards.getCardsAttachments(session);
            msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(card);
            break;
        default:
            msg = new builder.Message(session).text("收到：%s，字串長度：%s", session.message.text, session.message.text.length);
    }

    session.send(msg);
});

// Welcome mseeage, demo adaptive card
bot.on('conversationUpdate', function (message) {
    // Send a hello message when bot is added
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                // Display Welcome card with Hotels and Flights search options
                var msg = new builder.Message().address(message.address).text("歡迎使用展示機器人")
                    .addAttachment(cards.listCard);
                bot.send(msg);
            }
        });
    }
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());