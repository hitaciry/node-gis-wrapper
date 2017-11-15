import express  from 'express'
import EXPA from './wrapper'
import TelegramBot from 'node-telegram-bot-api'
import { Date } from 'core-js/library/web/timers';

const app= express();
app.post("/token", function (req, res) {
  EXPA(req.body.email,req.body.password).getNewToken().then(res.send).catch(res.send)
})
app.get("/",(req, res)=>res.send("I'm working"))

const login = 'a.shitikov90@gmail.com'
const password = 'hitaciry90'
const token = '457320898:AAF5Zv-Bw_rm2GHOdo2tyjcWv1etCU0NUTs';
// Включить опрос сервера
const bot = new TelegramBot(token, {polling: true});

// Написать мне ... (/echo Hello World! - пришлет сообщение с этим приветствием.)
bot.onText(/\/getNew/, function (msg, match) {
    const fromId = msg.from.id;
    const date = new Date()
    const resp = EXPA(login,password).post('people.json',{"filters[home_committee]":1618,
      "filters[registered[from]]":date}).then(data=>{console.log(data);})
    bot.sendMessage(fromId, 'Im work' );
});
bot.onText(/\/start/, (msg) => {
  
  bot.sendMessage(msg.chat.id, "Welcome");
      
  });
bot.onText(/\/hello/, function (msg, match) {
  const fromId = msg.from.id;
  const resp = 'hello';
  bot.sendMessage(fromId, resp);
});