import express  from 'express'
import EXPA from './wrapper'
import TelegramBot from 'node-telegram-bot-api'

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
const expa=EXPA(login,password)
bot.onText(/\/getNew/, function (msg, match) {
  console.log('get request')
const date = new Date()
    const fromId = msg.from.id;
    console.log(date.toJSON())
    const resp = expa.get('https://gis-api.aiesec.org/v2/people.json',
    { 'filters[home_committee]':1618,
      'filters[registered][from]':date.toJSON().slice(0,10)}).then(
       (response)=>{response.data.length>0?bot.sendMessage(msg.chat.id,response.data.map(user=>`${user.full_name} ${user.home_lc.name} ${user.referral_type}`).join('\n')) 
      :bot.sendMessage(msg.chat.id, 'Nothing new(' );
       console.log(response) 
      }).catch(console.log)
    bot.sendMessage(msg.chat.id, 'Im work...' );
});
bot.onText(/\/start/, (msg) => {
  console.log('get request')
  
  bot.sendMessage(msg.chat.id, "Welcome");
      
  });
bot.onText(/\/hello/, function (msg, match) {
  console.log('get request')
  const fromId = msg.from.id;
  const resp = 'hello';
  bot.sendMessage(fromId, resp);
});