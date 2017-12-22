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

const peopleReq = (chatIds, response, date) => {
  chatIds.forEach(id => {
    if (response.data.length > 0) {
      bot.sendMessage(id, `total ${response.paging.total_items} at ${date.toJSON()}`)
      response.data.map(u => expa.get(`people/${u.id}.json`).then((user) => {
        bot.sendMessage(id, `<a href="https://experience.aiesec.org/#/people/${user.id}" >${user.full_name}</a> ${user.home_lc.name} ${user.referral_type}`, {
          parse_mode: "HTML"
        })
      }).catch(console.log))
    } else
      bot.sendMessage(id, 'Nothing new(')
  })
}

const newMC = () => {
  const date = new Date()
  const dbData = db.ref('newMC').once('value', (data) => data.val()).then(data => {
    const resp = expa.get('https://gis-api.aiesec.org/v2/people.json', {
        'filters[home_committee]': 1618,
        'per_page': 100,
        'filters[registered][from]': date.toJSON().slice(0, 10)
      })
      .then((response) => {
        peopleReq(data[k], response, date)
      }).catch(console.log)
  })
}

const newLC = () => {
  const date = new Date()

  const dbData = db.ref('newLC').once('value', (data) => data.val()).then(data => {
    Object.keys(data).forEach((k) => {
      const resp = expa.get('https://gis-api.aiesec.org/v2/people.json', {
          'filters[home_committee]': k,
          'per_page': 100,
          'filters[registered][from]': date.toJSON().slice(0, 10)
        })
        .then((response) => {
          peopleReq(data[k], response, date)
        }).catch(console.log)
    })
  })
}

const lcep = () => {
  const date = new Date()
  const dbData = db.ref('lcep').once('value', (data) => data.val()).then(data => {
    Object.keys(data).forEach((k) => {
      const resp = expa.get('https://gis-api.aiesec.org/v2/people.json', {
          'filters[home_committee]': k,
          'per_page': 100
        })
        .then((response) => {

          if (response.data.length > 0) {
            var i = 0;
            response.data.map(u => expa.get(`people/${u.id}/applications.json`).then((applications) => {
                const relevant_apps = applications.data.filter(f => new Date(f.updated_at).toJSON().slice(0, 10) === date.toJSON().slice(0, 10))
                if (relevant_apps.length > 0) {
                  data.forEach(id =>
                    bot.sendMessage(id, `<a href="https://experience.aiesec.org/#/people/${user.id}" >${user.full_name}</a>
                      ${u.country_code}${u.phone}
                      ${applications.data.map((a)=>{`${a.status} at <a href="https://experience.aiesec.org/#/opportunities/${a.opportunity.id}">${a.opportunity.title}</a>\n`})}`, {
                      parse_mode: "HTML"
                    }))
                  i++;
                }
              }))
              .then(t => data.forEach(id => bot.sendMessage(id, `total changes ${i} at ${date.toJSON()}`))).catch(console.log)
          } else
            data.forEach(id => bot.sendMessage(id, 'Nothing new('))
        })
    }).catch(console.log)
  })
}

lcep()
newMC()
newLC()