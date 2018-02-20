var builder = require('botbuilder');

let listCard = {
    'contentType': 'application/vnd.microsoft.card.adaptive',
    'content': {
        '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
        'type': 'AdaptiveCard',
        'version': '1.0',
        'body': [{
            'type': 'Container',
            'speak': '<s>Hello!</s><s>選擇下列項目來觀看呈現結果</s>',
            'items': [{
                'type': 'ColumnSet',
                'columns': [{
                    'type': 'Column',
                    'size': 'auto',
                    'items': [{
                        'type': 'Image',
                        'url': 'https://i.imgur.com/3xZ4Cdx.png',
                        'size': 'medium',
                        'style': 'person'
                    }]
                }, {
                    'type': 'Column',
                    'size': 'stretch',
                    'items': [{
                            'type': 'TextBlock',
                            'text': '展示機器人!',
                            'weight': 'bolder',
                            'isSubtle': true
                        },
                        {
                            'type': 'TextBlock',
                            'text': '選擇下列項目來觀看呈現結果',
                            'wrap': true
                        }
                    ]
                }]
            }]
        }],
        'actions': [
            // Hotels Search form
            {
                'type': 'Action.Submit',
                'title': 'Hero Card',
                'speak': '<s>Hero Card</s>',
                'data': 'HeroCard'
            }, {
                'type': 'Action.Submit',
                'title': 'Thumbnail Card',
                'speak': '<s>Thumbnail Card</s>',
                'data': 'ThumbnailCard'
            }, {
                'type': 'Action.Submit',
                'title': 'Receipt Card',
                'speak': '<s>Receipt Card</s>',
                'data': 'ReceiptCard'
            }, {
                'type': 'Action.Submit',
                'title': 'Signin Card',
                'speak': '<s>Signin Card</s>',
                'data': 'SigninCard'
            }, {
                'type': 'Action.Submit',
                'title': 'Animation Card',
                'speak': '<s>Animation Card</s>',
                'data': 'AnimationCard'
            }, {
                'type': 'Action.Submit',
                'title': 'Video Card',
                'speak': '<s>Video Card</s>',
                'data': 'VideoCard'
            }, {
                'type': 'Action.Submit',
                'title': 'Audio Card',
                'speak': '<s>Audio Card</s>',
                'data': 'AudioCard'
            },            {
                'type': 'Action.Submit',
                'title': 'Carousel Card',
                'speak': '<s>Carousel Card</s>',
                'data': 'CarouselCard'
            }
        ]
    }
};

module.exports = {
    createHeroCard: function createHeroCard(session) {
        return new builder.HeroCard(session)
            .title('Azure Bot Service')
            .subtitle('聊天機器人')
            .text('建置、連線、部署及管理智慧機器人，使其在網路、應用程式、Cortana、Microsoft Teams、Skype、Slack、Facebook Messenger 等管道上，與您的使用者自然地互動。利用完整的機器人建置環境快速入門。')
            .images([
                builder.CardImage.create(session, 'https://azurecomcdn.azureedge.net/cvt-071a8257034e642968baa286b4aec156c0678f9c4939a52889db8e7b4ede45da/images/page/services/bot-service/accelerated.svg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/zh-tw/services/bot-service/', '開始使用..')
            ]);
    },

    createThumbnailCard: function createThumbnailCard(session) {
        return new builder.ThumbnailCard(session)
            .title('Azure Bot Service')
            .subtitle('聊天機器人')
            .text('建置、連線、部署及管理智慧機器人，使其在網路、應用程式、Cortana、Microsoft Teams、Skype、Slack、Facebook Messenger 等管道上，與您的使用者自然地互動。利用完整的機器人建置環境快速入門。')
            .images([
                builder.CardImage.create(session, 'https://azurecomcdn.azureedge.net/cvt-071a8257034e642968baa286b4aec156c0678f9c4939a52889db8e7b4ede45da/images/page/services/bot-service/accelerated.svg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', '開始使用..')
            ]);
    },
    createReceiptCard: function createReceiptCard(session) {
        return new builder.ReceiptCard(session)
            .title('Money Yu')
            .facts([
                builder.Fact.create(session, "003985829", '訂單編號'),
                builder.Fact.create(session, 'VISA 5555-****', '付款方式')
            ])
            .items([
                builder.ReceiptItem.create(session, '$ 38.45', 'Data Transfer')
                .quantity(368)
                .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png')),
                builder.ReceiptItem.create(session, '$ 45.00', 'App Service')
                .quantity(720)
                .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png'))
            ])
            .tax('$ 7.50')
            .total('$ 90.95')
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/pricing/', '更多資訊')
                .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
            ]);
    },

    createSigninCard: function createSigninCard(session) {
        return new builder.SigninCard(session)
            .text('BotFramework Sign-in Card')
            .button('登入', 'https://login.microsoftonline.com');
    },

    createAnimationCard: function createAnimationCard(session) {
        return new builder.AnimationCard(session)
            .title('Animation Card')
            .subtitle('動畫卡')
            .image(builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png'))
            .media([{
                url: 'http://i.imgur.com/SJgMp1f.gif'
            }]);
    },
    createVideoCard: function createVideoCard(session) {
        return new builder.VideoCard(session)
            .title('Big Buck Bunny')
            .subtitle('大雄兔')
            .text('大雄兔是 Blender 基金會第 2 部開放授權、創作共用的動畫電影，代號 Peach。片長 10 分鐘，Big Buck Bunny 全部使用開放原始碼軟體製作（如 Blender、Linux），彩現的計算機集群使用昇陽電腦公司的 Sun Grid 亦是開放原始碼的（如：OpenSolaris、Sun Grid Engine 等），製作技術和素材徹底公開。不同於上一個專案 Elephants Dream，本篇全程無語音。本片完成之後，其素材適用在 blender 官方的遊戲專案 Yo Frankie! 之中，反派 Frankie 這次成為主角。')
            .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg'))
            .media([{
                url: 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4'
            }])
            .buttons([
                builder.CardAction.openUrl(session, 'https://peach.blender.org/', '更多資訊..')
            ]);
    },
    createAudioCard: function createAudioCard(session) {
        return new builder.AudioCard(session)
            .title('I am your father')
            .subtitle('星際大戰五部曲：帝國大反擊')
            .text('《星際大戰五部曲：帝國大反擊》是一部於 1980 年 5 月上映的美國科幻片，為喬治 · 盧卡斯電影《星際大戰》系列的第五集（拍攝順序上的第二部），故事內容是銀河帝國的超級武器「死星」雖被反抗軍摧毀，但勢力再興。反抗軍節節敗退，在苟延殘喘中期待曙光乍現。路克 · 天行者走上絕地武士的道路並面臨著走向光明或是黑暗的抉擇。')
            .image(builder.CardImage.create(session, 'https://i.imgur.com/LQOwQnO.png'))
            .media([{
                url: 'http://www.wavlist.com/movies/004/father.wav'
            }])
            .buttons([
                builder.CardAction.openUrl(session, 'https://zh.wikipedia.org/wiki/%E6%98%9F%E9%9A%9B%E5%A4%A7%E6%88%B0%E4%BA%94%E9%83%A8%E6%9B%B2%EF%BC%9A%E5%B8%9D%E5%9C%8B%E5%A4%A7%E5%8F%8D%E6%93%8A', '更多資訊..')
            ]);
    },
    getCardsAttachments: function getCardsAttachments(session) {
        return [
            new builder.HeroCard(session)
            .title('Azure 儲存體')
            .subtitle('減輕繁重的資料中心管理工作')
            .text('Microsoft Azure 儲存體是 Microsoft 管理的雲端服務，可提供高度可用、安全、持久、可擴充和備援的儲存體。 Azure 儲存體包含 Blob 儲存體、檔案儲存體和佇列儲存體。')
            .images([
                builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/aspnet/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/data-storage-options/_static/image5.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/zh-tw/services/storage/', '瞭解更多')
            ]),

            new builder.HeroCard(session)
            .title('Azure Cosmos DB')
            .subtitle('全域散發的多模型資料庫服務')
            .text('全新打造的 Azure Cosmos DB 具備全域散發功能，且可依其核心進行水平調整。不論您的使用者身在何處，都可以透明調整及複寫您的資料，以周全地全域散發到任何數目的 Azure 區域。無論是在世界各地，皆可彈性調整輸送量與儲存體規模，而且只需支付您需要使用的費用即可。Azure Cosmos DB 為 No SQL 選項提供原生支援、提供多項定義完善的一致性模型、保證 99 百分位數不超過十毫秒的延遲，並利用多重路徑連線功能以及全球各地低延遲來提供高可用性。')
            .images([
                builder.CardImage.create(session, 'https://azure.microsoft.com/svghandler/cosmos-db?width=600&height=315')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/zh-tw/services/cosmos-db/', '瞭解更多'),
                builder.CardAction.downloadFile(session,"https://azure.microsoft.com/svghandler/cosmos-db?width=600&height=315","Download")
            ]),

            new builder.HeroCard(session)
            .title('Azure Web Apps')
            .subtitle('建立並部署可隨業務調整的任務關鍵性 Web 應用程式')
            .text('用來裝載 Web 應用程式、REST API 和行動後端的服務。 您可以使用您慣用的語言進行開發，不管是 .NET、.NET Core、Java、Ruby、Node.js、PHP 還是 Python 都可以。 您可以輕鬆地在 Windows 或 Linux VM 上執行和調整應用程式。')
            .images([
                builder.CardImage.create(session, 'https://aspblogs.blob.core.windows.net/media/scottgu/WindowsLiveWriter/AnnouncingthenewAzureAppService_122D1/image_4.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/zh-tw/services/app-service/web/', '瞭解更多')
            ]),

            new builder.HeroCard(session)
            .title('認知服務')
            .subtitle('使用 AI 來解決業務問題')
            .text('在您的應用程式、網站和 Bot 中融入智慧型演算法，透過自然的溝通方式，來查看、聆聽、述說、了解及詮釋您的使用者需求。立即使用 AI 轉換您的業務。')
            .images([
                builder.CardImage.create(session, 'https://www.onmsft.com/wp-content/uploads/2017/05/Cog-Serv-1032x580.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/zh-tw/services/cognitive-services/', '瞭解更多')
            ])
        ];
    },
    listCard
};