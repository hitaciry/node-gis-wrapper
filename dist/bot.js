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
var expa = (0, _wrapper2.default)(login, password);
bot.onText(/\/getNew/, function (msg, match) {
  console.log('get request');
  var date = new Date();
  var fromId = msg.from.id;
  var blackList = msg.from.username === 'Tanichitto';
  console.log(date.toJSON());
  var resp = expa.get('https://gis-api.aiesec.org/v2/people.json', { 'filters[home_committee]': 1618,
    'per_page': 100,
    'filters[registered][from]': date.toJSON().slice(0, 10) }).then(function (response) {
    if (blackList) {
      bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
      return;
    }
    if (response.data.length > 0) {
      bot.sendMessage(msg.chat.id, 'total ' + response.paging.total_items + ' at ' + date.toJSON());
      response.data.map(function (u) {
        return expa.get('people/' + u.id + '.json').then(function (user) {
          bot.sendMessage(msg.chat.id, '<a href="https://experience.aiesec.org/#/people/' + user.id + '" >' + user.full_name + '</a> ' + user.home_lc.name + ' ' + user.referral_type, { parse_mode: "HTML" });
        }).catch(console.log);
      });
    } else bot.sendMessage(msg.chat.id, 'Nothing new(');
  }).catch(console.log);
  bot.sendMessage(msg.chat.id, 'Im work...');
});

bot.onText(/\/lc/, function (msg, match) {
  console.log('get request');
  var date = new Date();
  var fromId = msg.from.id;
  var blackList = msg.from.username !== 'Tanichitto';
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
    return;
  }
  console.log(date.toJSON());
  var resp = expa.get('https://gis-api.aiesec.org/v2/committees/1618.json').then(function (response) {
    response.suboffices.map(function (u) {
      bot.sendMessage(msg.chat.id, u.id + ' ' + u.name);
    });
  }).catch(console.log);
  bot.sendMessage(msg.chat.id, 'Im work...');
});
bot.onText(/\/getNewLC (.+)/, function (msg, match) {
  console.log('get request');
  var date = new Date();
  var fromId = msg.from.id;
  var blackList = msg.from.username !== 'Tanichitto';
  console.log(date.toJSON());
  var resp = expa.get('https://gis-api.aiesec.org/v2/people.json', { 'filters[home_committee]': match[1],
    'per_page': 100,
    'filters[registered][from]': date.toJSON().slice(0, 10) }).then(function (response) {
    if (blackList) {
      bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
      return;
    }
    if (response.data.length > 0) {
      bot.sendMessage(msg.chat.id, 'total ' + response.paging.total_items + ' at ' + date.toJSON());
      response.data.map(function (u) {
        return expa.get('people/' + u.id + '.json').then(function (user) {
          bot.sendMessage(msg.chat.id, '<a href="https://experience.aiesec.org/#/people/' + user.id + '" >' + user.full_name + '</a> ' + user.home_lc.name + ' ' + user.referral_type, { parse_mode: "HTML" });
        }).catch(console.log);
      });
    } else bot.sendMessage(msg.chat.id, 'Nothing new(');
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
  var resp = 'hello, dear ' + msg.from.first_name + '\n\n  Commands:\n\n  /getNew - return all users who registered today on GMT time in AIESEC Russia\n\n  /lc -return list of LC with name and Id\n\n  /getNewLC <replace with LC id> - return all users who registered today on GMT time in LC with id\n\n                ';
  bot.sendMessage(fromId, resp);
});