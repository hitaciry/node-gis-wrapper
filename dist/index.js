'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _wrapper = require('./wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

var _nodeTelegramBotApi = require('node-telegram-bot-api');

var _nodeTelegramBotApi2 = _interopRequireDefault(_nodeTelegramBotApi);

var _timers = require('core-js/library/web/timers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.post("/token", function (req, res) {
  (0, _wrapper2.default)(req.body.email, req.body.password).getNewToken().then(res.send).catch(res.send);
});
app.get("/", function (req, res) {
  return res.send("I'm working");
});

var login = 'a.shitikov90@gmail.com';
var password = 'hitaciry90';
var token = '457320898:AAF5Zv-Bw_rm2GHOdo2tyjcWv1etCU0NUTs';
// Включить опрос сервера
var bot = new _nodeTelegramBotApi2.default(token, { polling: true });

// Написать мне ... (/echo Hello World! - пришлет сообщение с этим приветствием.)
bot.onText(/\/getNew/, function (msg, match) {
  var fromId = msg.from.id;
  var date = new _timers.Date();
  var resp = (0, _wrapper2.default)(login, password).post('people.json', { "filters[home_committee]": 1618,
    "filters[registered[from]]": date }).then(function (data) {
    console.log(data);
  });
  bot.sendMessage(fromId, 'Im work');
});
bot.onText(/\/start/, function (msg) {

  bot.sendMessage(msg.chat.id, "Welcome");
});
bot.onText(/\/hello/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = 'hello';
  bot.sendMessage(fromId, resp);
});
