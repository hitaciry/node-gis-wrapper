'use strict';

var _wrapper = require('./wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

var _nodeTelegramBotApi = require('node-telegram-bot-api');

var _nodeTelegramBotApi2 = _interopRequireDefault(_nodeTelegramBotApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var login = 'a.shitikov90@gmail.com';
var password = 'hitaciry90';
var token = '457320898:AAF5Zv-Bw_rm2GHOdo2tyjcWv1etCU0NUTs';
// Включить опрос сервера
var bot = new _nodeTelegramBotApi2.default(token, { polling: true });
// Написать мне ... (/echo Hello World! - пришлет сообщение с этим приветствием.)
var expa = (0, _wrapper2.default)(login, password);
bot.onText(/\/getNew/, function (msg, match) {
  console.log('get request');
  var date = new Date();
  var fromId = msg.from.id;
  console.log(date.toJSON());
  var resp = expa.get('https://gis-api.aiesec.org/v2/people.json', { 'filters[home_committee]': 1618,
    'per_page': 100,
    'filters[registered][from]': date.toJSON().slice(0, 10) }).then(function (response) {
    response.data.length > 0 ? bot.sendMessage(msg.chat.id, ('total ' + response.paging.total_items + '\n').concat(response.data.map(function (user) {
      return user.full_name + ' ' + user.home_lc.name + ' ' + user.referral_type;
    }).join('\n'))) : bot.sendMessage(msg.chat.id, 'Nothing new(');
  }).catch(console.log);
  bot.sendMessage(msg.chat.id, 'Im work...');
});
bot.onText(/\/start/, function (msg) {
  console.log('get request');

  bot.sendMessage(msg.chat.id, "Welcome");
});
bot.onText(/\/hello/, function (msg, match) {
  console.log('get request');
  var fromId = msg.from.id;
  var resp = 'hello';
  bot.sendMessage(fromId, resp);
});