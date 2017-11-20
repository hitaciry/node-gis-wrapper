import EXPA from './wrapper'
import TelegramBot from 'node-telegram-bot-api'

const login = 'a.shitikov90@gmail.com'
const password = 'hitaciry90'
const token = '457320898:AAF5Zv-Bw_rm2GHOdo2tyjcWv1etCU0NUTs';
// Включить опрос сервера
const bot = new TelegramBot(token, {polling: true});
const expa=EXPA(login,password)
bot.onText(/\/getNew/, function (msg, match) {
  console.log('get request')
const date = new Date()
    const fromId = msg.from.id;
    console.log(date.toJSON())
    const resp = expa.get('https://gis-api.aiesec.org/v2/people.json',
    { 'filters[home_committee]':1618,
      'per_page':100,
      'filters[registered][from]':date.toJSON().slice(0,10)})
      .then((response)=>{
        if(response.data.length>0){
          bot.sendMessage(msg.chat.id,`total ${response.paging.total_items} at ${date.toJSON()}`)
          response.data.map(u=>expa.get(`people/${u.id}.json`).then((user)=>{
            bot.sendMessage(msg.chat.id,`<a href="https://experience.aiesec.org/#/people/${user.id}" >${user.full_name}</a> ${user.home_lc.name} ${user.referral_type}`,{parse_mode : "HTML"})
          }).catch(console.log))
        }
          else
            bot.sendMessage(msg.chat.id, 'Nothing new(' )
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
  const resp = `hello, dear ${msg.from.first_name}\nCommands:\n/getNew - return all users who registered today on GMT time in AIESEC Russia`;
  bot.sendMessage(fromId, resp);
});