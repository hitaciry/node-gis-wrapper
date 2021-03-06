import EXPA from './wrapper'
import TelegramBot from 'node-telegram-bot-api'
//import * as serviceAccount from "db.json"
import firebase from "firebase"

const login = 'a.shitikov90@gmail.com'
const password = 'hitaciry90'
const token = '457320898:AAF5Zv-Bw_rm2GHOdo2tyjcWv1etCU0NUTs';

const config = {
  apiKey: "7OlVhkAn0Q5NDiUeuK50MXhTCt9hqn7hRvSV5vyI",
  authDomain: "bot-db-935c6.firebaseapp.com",
  databaseURL: "https://bot-db-935c6.firebaseio.com"
}
const db = firebase.database(firebase.initializeApp(config))

// Включить опрос сервера
const bot = new TelegramBot(token, {
  polling: true
});
const expa = EXPA(login, password)
bot.onText(/\/newMC/, function (msg, match) {
  const date = new Date()
  const fromId = msg.from.id;
  const blackList = msg.from.username === 'Tanichitto'
  const resp = expa.get('https://gis-api.aiesec.org/v2/people.json', {
      'filters[home_committee]': 1618,
      'per_page': 100,
      'filters[registered][from]': date.toJSON().slice(0, 10)
    })
    .then((response) => {
      if (blackList) {
        bot.sendMessage(msg.chat.id, 'user not allowed to make this request')
        return
      }
      if (response.data.length > 0) {
        bot.sendMessage(msg.chat.id, `total ${response.paging.total_items} at ${date.toJSON()}`)
        response.data.map(u => expa.get(`people/${u.id}.json`).then((user) => {
          bot.sendMessage(msg.chat.id, `<a href="https://experience.aiesec.org/#/people/${user.id}" >${user.full_name}</a> ${user.home_lc.name} ${user.referral_type}`, {
            parse_mode: "HTML"
          })
        }).catch(console.log))
      } else
        bot.sendMessage(msg.chat.id, 'Nothing new(')
    }).catch(console.log)
  bot.sendMessage(msg.chat.id, 'Im work...');
});
bot.onText(/\/newMC/, function (msg, match) {
  const date = new Date()
  const fromId = msg.from.id;
  const blackList = msg.from.username === 'Tanichitto'
  db.ref('newMC').push(fromId).then(t => bot.sendMessage(msg.chat.id, 'you successfully subscribed to notifications'))
  bot.sendMessage(msg.chat.id, 'Im work...')
});

bot.onText(/\/lc/, function (msg, match) {
  const fromId = msg.from.id;
  const blackList = msg.from.username === 'Tanichitto'
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request')
    return
  }
  const resp = expa.get('https://gis-api.aiesec.org/v2/committees/1618.json')
    .then((response) => {
      response.suboffices.filter(f => !f.name.includes('Closed')).map(u => {
        bot.sendMessage(msg.chat.id, `${u.id} ${u.name}`)
      })
    }).catch(console.log)
  bot.sendMessage(msg.chat.id, 'Im work...');
});

bot.onText(/\/newLC (.+)/, function (msg, match) {
  const date = new Date()
  const fromId = msg.from.id;
  const blackList = msg.from.username === 'Tanichitto'
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request')
    return
  }
  const resp = expa.get('https://gis-api.aiesec.org/v2/people.json', {
      'filters[home_committee]': match[1],
      'per_page': 100,
      'filters[registered][from]': date.toJSON().slice(0, 10)
    })
    .then((response) => {
      if (response.data.length > 0) {
        bot.sendMessage(msg.chat.id, `total ${response.paging.total_items} at ${date.toJSON()}`)
        response.data.map(u => expa.get(`people/${u.id}.json`).then((user) => {
          bot.sendMessage(msg.chat.id, `<a href="https://experience.aiesec.org/#/people/${user.id}" >${user.full_name}</a> ${user.home_lc.name} ${user.referral_type}`, {
            parse_mode: "HTML"
          })
        }).catch(console.log))
      } else
        bot.sendMessage(msg.chat.id, 'Nothing new(')
    }).catch(console.log)
  bot.sendMessage(msg.chat.id, 'Im work...');
});

bot.onText(/\/newLCs (.+)/, function (msg, match) {
  const date = new Date()
  const fromId = msg.from.id;
  const blackList = msg.from.username === 'Tanichitto'
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request')
    return
  }
  db.ref('newLC/' + match[1]).push(fromId).then(t => bot.sendMessage(msg.chat.id, 'you successfully subscribed to notifications'))
  bot.sendMessage(msg.chat.id, 'Im work...')
});

bot.onText(/\/myep (.+) (.+)/, function (msg, match) {
  const expa_ = EXPA(match[1], match[2])
  const date = new Date()
  const fromId = msg.from.id;
  const blackList = msg.from.username === 'Tanichitto'
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request')
    return
  }
  const resp = expa_.get('https://gis-api.aiesec.org/v2/people.json', {
      'filters[my]': true,
      'per_page': 100
    })
    .then((response) => {
      if (response.data.length > 0) {
        bot.sendMessage(msg.chat.id, `total ${response.paging.total_items} at ${date.toJSON()}`)
        response.data.map(u => expa.get(`people/${u.id}/applications.json`).then((applications) => {
          const relevant_apps = applications.data.filter(f => new Date(f.updated_at).toJSON().slice(0, 10) === date.toJSON().slice(0, 10))
          if (relevant_apps.length > 0) {
            bot.sendMessage(msg.chat.id, `<a href="https://experience.aiesec.org/#/people/${user.id}" >${user.full_name}</a>
                ${u.country_code}${u.phone}
                ${applications.data.map((a)=>{`${a.status} at <a href="https://experience.aiesec.org/#/people/${a.opportunity.id}">${a.opportunity.title}</a>\n`})}`, {
              parse_mode: "HTML"
            })
          }
        }).catch(console.log))
      } else
        bot.sendMessage(msg.chat.id, 'Nothing new(')
    }).catch(console.log)
  bot.sendMessage(msg.chat.id, 'Im work...');
});
bot.onText(/\/lcep (.+)/, function (msg, match) {
  const date = new Date()
  const blackList = msg.from.username === 'Tanichitto'
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request')
    return
  }
  const resp = expa_.get('https://gis-api.aiesec.org/v2/people.json', {
      'filters[home_committee]': match[1],
      'per_page': 100
    })
    .then((response) => {
      if (response.data.length > 0) {
        var i = 0;
        response.data.map(u => expa.get(`people/${u.id}/applications.json`).then((applications) => {
            const relevant_apps = applications.data.filter(f => new Date(f.updated_at).toJSON().slice(0, 10) === date.toJSON().slice(0, 10))
            if (relevant_apps.length > 0) {
              bot.sendMessage(msg.chat.id, `<a href="https://experience.aiesec.org/#/people/${user.id}" >${user.full_name}</a>
                  ${u.country_code}${u.phone}
                  ${applications.data.map((a)=>{`${a.status} at <a href="https://experience.aiesec.org/#/opportunities/${a.opportunity.id}">${a.opportunity.title}</a>\n`})}`, {
                parse_mode: "HTML"
              })
              i++;
            }
          }))
          .then(t => bot.sendMessage(msg.chat.id, `total changes ${i} at ${date.toJSON()}`)).catch(console.log)
      } else
        bot.sendMessage(msg.chat.id, 'Nothing new(')
    }).catch(console.log)
  bot.sendMessage(msg.chat.id, 'Im work...');
});

bot.onText(/\/lceps (.+)/, function (msg, match) {
  const date = new Date()
  const fromId = msg.from.id;
  const blackList = msg.from.username === 'Tanichitto'
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request')
    return
  }
  db.ref('lcep/' + match[1]).push(fromId).then(t => bot.sendMessage(msg.chat.id, 'you successfully subscribed to notifications'))
  bot.sendMessage(msg.chat.id, 'Im work...')
});

bot.onText(/\/applicants (.+) (.+) (.+)/, function (msg, match) {
  try {
    const date = new Date()
    const fromId = msg.from.id;
    const blackList = msg.from.username === 'Tanichitto'
    if (blackList) {
      bot.sendMessage(msg.chat.id, 'user not allowed to make this request')
      return
    }
    const resp = match[1].split(',').map(id => {
      expa_.get(`https://experience.aiesec.org/#/opportunities/${id}/applications`, {
          'filters[home_committee]': match[1],
          'per_page': 100
        })
        .then((response) => {
          var applicants = response.data.filter(f => (!match[2] || new Date(f.created_at) >= match[2]) && (!match[3] || new Date(f.created_at) <= match[3]))
          if (applicants.length > 0) {
            applicants.map(u => {
              expa.get(`opportunities/${id}/applicant.json?person_id=${u.person.id}`, ).then((applicant) => {
                bot.sendMessage(msg.chat.id, `<a href="https://experience.aiesec.org/#/opportunities/${id}/applicant.json?person_id=${u.person.id}" >${applicant.full_name}</a> 
                  +${applicant.contact_info.country_code}${applicant.contact_info.phone}
                  ${aplicant.home_lc.country}
                  ${u.status}
                  ${applicant.managers[0]?`<a href='mailto:${applicant.managers[0].email}'>${applicant.managers[0].full_name}</a> 
                  +${applicant.managers[0].contact_info.country_code}${applicant.managers[0].contact_info.phone} `:'no managers'}`, {
                  parse_mode: "HTML"
                })
              })
            })
          } else
            bot.sendMessage(msg.chat.id, `Nothing new for ${id}(`)
        }).catch(e => bot.sendMessage(msg.chat.id, e.message))
    })
    bot.sendMessage(msg.chat.id, 'Im work...');
  } catch (e) {
    bot.sendMessage(msg.chat.id, e.message)
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome");
});
bot.onText(/\/hello/, function (msg, match) {
  const fromId = msg.from.id;
  const resp = `hello, dear ${msg.from.first_name}
  Commands:
  /newMC - return all users who registered today on GMT time in AIESEC Russia
  /newMCs - subscribe to all users who registered today on GMT time in AIESEC Russia
  /lc - return list of LC with name and Id
  /newLC <LC id> - return all users who registered today (on GMT time) at LC with id
  /newLCs <LC id>- subscribe to all users who registered today (on GMT time) at LC with id
  /myep <login> <password> - return your eps with changed state
  /lcep <LC id> - return eps with changed state for LC id
  /lceps <LC id> - subscribe to eps with changed state for LC id
  /applicants <TN ids separate by ','> <start date> <end date> - return applicants for TNs, who was applied between start and end dates(YYYY-MM-DD)`;
  bot.sendMessage(fromId, resp);
});