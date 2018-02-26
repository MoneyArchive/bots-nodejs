// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder'),
    needle = require('needle'),
    restify = require('restify'),
    url = require('url'),
    validUrl = require('valid-url'),
    captionService = require('./caption-service'),
    cards = require("./cards");

var fs = require('fs');
var rooms = require("./rooms.json");

// Application Insight
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

    if (hasImageAttachment(session)) {
        var stream = getImageStreamFromMessage(session.message);
        captionService
            .getCaptionFromStream(stream)
            .then(function (caption) {
                handleSuccessResponse(session, "I think it's " + caption);
            })
            .catch(function (error) {
                handleErrorResponse(session, error);
            });

        captionService.getFaceFromStream(stream)
            .then(function (caption) {
                handleSuccessResponse(session, "人臉：\n\n" + caption);
            })
            .catch(function (error) {
                handleErrorResponse(session, error);
            });
    } else {
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
            case "menu":
            case "Menu":
                var card = cards.cardList(session);
                msg = new builder.Message(session).addAttachment(card);
                break;
            default:
                msg = new builder.Message(session).text("收到：%s，字串長度：%s", session.message.text, session.message.text.length);
        }
    }

    session.send(msg);
});

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

// welcome intent
bot.dialog('welcome', function (session) {
    session.endDialog("Welcome, 您向我問好，您說：" + session.message.text);
}).triggerAction({
    matches: 'welcome'
});

// query intent
bot.dialog('query', [
    function (session, args, next) {
        var roomEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'room');
        if (!roomEntity) {
            builder.Prompts.text(session, '請輸入欲查詢之會議室');
        } else {
            next({
                response: roomEntity.entity
            });
        }
    },
    function (session, results) {
        var roomName = results.response;

        // query room status
        var room = rooms.filter(function (value) {
            return value.hasOwnProperty(roomName); // Get only elements, which have such a key
        })[0];

        if (room) {
            var msg = "會議室：" + roomName + "，" + (room.isLend ? "已被租借" : "尚未租借");
        } else {
            var msg = "找不到會議室：" + roomName;
        }

        session.endDialog(msg);
    }
]).triggerAction({
    matches: 'query',
    onInterrupted: function (session) {
        session.send('請輸入欲查詢之會議室');
    }
});

// lend intent
bot.dialog('lend', [function (session, args, next) {
        var roomEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'room');
        if (!roomEntity) {
            builder.Prompts.text(session, '請輸入欲租借之會議室');
        } else {
            next({
                response: roomEntity.entity
            });
        }
    },
    function (session, results) {
        var roomName = results.response;

        // query room status
        var room = rooms.filter(function (value) {
            return value.hasOwnProperty(roomName); // Get only elements, which have such a key
        })[0];

        if (room) {
            if (room.isLend) {
                var msg = "會議室：" + roomName + "，" + "已被租借，租借失敗！";
            } else {
                room.isLend = true;
                fs.writeFile("./rooms.json", JSON.stringify(rooms), function (err) {
                    if (err) return console.log(err);
                    console.log(JSON.stringify(rooms));
                    console.log('writing to ' + "./rooms.json");
                })
                var msg = "會議室：" + roomName + "，" + "租借成功！";
            }
        } else {
            var msg = "找不到會議室：" + roomName;
        }

        session.endDialog(msg);
    }
]).triggerAction({
    matches: 'lend'
});

// return intent
bot.dialog('return', [function (session, args, next) {
    var roomEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'room');
    if (!roomEntity) {
        builder.Prompts.text(session, '請輸入欲歸還之會議室');
    } else {
        next({
            response: roomEntity.entity
        });
    }
},
function (session, results) {
    var roomName = results.response;

    // query room status
    var room = rooms.filter(function (value) {
        return value.hasOwnProperty(roomName); // Get only elements, which have such a key
    })[0];

    if (room) {
        if (!room.isLend) {
            var msg = "會議室：" + roomName + "，" + "尚未被租借，歸還失敗！";
        } else {
            room.isLend = false;
            fs.writeFile("./rooms.json", JSON.stringify(rooms), function (err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(rooms));
                console.log('writing to ' + "./rooms.json");
            })
            var msg = "會議室：" + roomName + "，" + "歸還成功！";
        }
    } else {
        var msg = "找不到會議室：" + roomName;
    }

    session.endDialog(msg);
}
]).triggerAction({
    matches: 'return'
});

// Welcome mseeage, demo adaptive card
bot.on('conversationUpdate', function (message) {
    // Send a hello message when bot is added
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                // Display Welcome card with Hotels and Flights search options
                var msg = new builder.Message().address(message.address).text("歡迎使用展示機器人，輸入 Menu 來展開選單")
                bot.send(msg);
            }
        });
    }
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Utilities
function hasImageAttachment(session) {
    return session.message.attachments.length > 0 &&
        session.message.attachments[0].contentType.indexOf('image') !== -1;
}

function getImageStreamFromMessage(message) {
    var headers = {};
    var attachment = message.attachments[0];
    if (checkRequiresToken(message)) {
        // The Skype attachment URLs are secured by JwtToken,
        // you should set the JwtToken of your bot as the authorization header for the GET request your bot initiates to fetch the image.
        // https://github.com/Microsoft/BotBuilder/issues/662
        connector.getAccessToken(function (error, token) {
            var tok = token;
            headers['Authorization'] = 'Bearer ' + token;
            headers['Content-Type'] = 'application/octet-stream';

            return needle.get(attachment.contentUrl, {
                headers: headers
            });
        });
    }

    headers['Content-Type'] = attachment.contentType;
    return needle.get(attachment.contentUrl, {
        headers: headers
    });
}

function checkRequiresToken(message) {
    return message.source === 'skype' || message.source === 'msteams';
}

/**
 * Gets the href value in an anchor element.
 * Skype transforms raw urls to html. Here we extract the href value from the url
 * @param {string} input Anchor Tag
 * @return {string} Url matched or null
 */
function parseAnchorTag(input) {
    var match = input.match('^<a href=\"([^\"]*)\">[^<]*</a>$');
    if (match && match[1]) {
        return match[1];
    }

    return null;
}

// Response Handling
function handleSuccessResponse(session, caption) {
    if (caption === "人臉：" || caption === "I think it\'s ") {

    } else if (caption) {
        session.send(caption);
    } else {
        session.send('找不到相關資訊');
    }

}

function handleErrorResponse(session, error) {
    var clientErrorMessage = 'Oops! 出錯囉..\n\n\n\n' + error.message;

    console.error(error);
    session.send(clientErrorMessage);
}