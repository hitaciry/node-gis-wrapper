'use strict';

var _wrapper = require('./wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

var _nodeTelegramBotApi = require('node-telegram-bot-api');

var _nodeTelegramBotApi2 = _interopRequireDefault(_nodeTelegramBotApi);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var login = 'a.shitikov90@gmail.com';
//import * as serviceAccount from "db.json"

var password = 'hitaciry90';
var token = '457320898:AAF5Zv-Bw_rm2GHOdo2tyjcWv1etCU0NUTs';

var config = {
  apiKey: "7OlVhkAn0Q5NDiUeuK50MXhTCt9hqn7hRvSV5vyI",
  authDomain: "bot-db-935c6.firebaseapp.com",
  databaseURL: "https://bot-db-935c6.firebaseio.com"
};
var db = _firebase2.default.database(_firebase2.default.initializeApp(config));

// Включить опрос сервера
var bot = new _nodeTelegramBotApi2.default(token, {
  polling: true
});
var expa = (0, _wrapper2.default)(login, password);
bot.onText(/\/newMC/, function (msg, match) {
  var date = new Date();
  var fromId = msg.from.id;
  var blackList = msg.from.username === 'Tanichitto';
  var resp = expa.get('https://gis-api.aiesec.org/v2/people.json', {
    'filters[home_committee]': 1618,
    'per_page': 100,
    'filters[registered][from]': date.toJSON().slice(0, 10)
  }).then(function (response) {
    if (blackList) {
      bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
      return;
    }
    if (response.data.length > 0) {
      bot.sendMessage(msg.chat.id, 'total ' + response.paging.total_items + ' at ' + date.toJSON());
      response.data.map(function (u) {
        return expa.get('people/' + u.id + '.json').then(function (user) {
          bot.sendMessage(msg.chat.id, '<a href="https://experience.aiesec.org/#/people/' + user.id + '" >' + user.full_name + '</a> ' + user.home_lc.name + ' ' + user.referral_type, {
            parse_mode: "HTML"
          });
        }).catch(console.log);
      });
    } else bot.sendMessage(msg.chat.id, 'Nothing new(');
  }).catch(console.log);
  bot.sendMessage(msg.chat.id, 'Im work...');
});
bot.onText(/\/newMC/, function (msg, match) {
  var date = new Date();
  var fromId = msg.from.id;
  var blackList = msg.from.username === 'Tanichitto';
  db.ref('newMC').push(fromId).then(function (t) {
    return bot.sendMessage(msg.chat.id, 'you successfully subscribed to notifications');
  });
  bot.sendMessage(msg.chat.id, 'Im work...');
});

bot.onText(/\/lc/, function (msg, match) {
  var fromId = msg.from.id;
  var blackList = msg.from.username === 'Tanichitto';
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
    return;
  }
  var resp = expa.get('https://gis-api.aiesec.org/v2/committees/1618.json').then(function (response) {
    response.suboffices.filter(function (f) {
      return !f.name.includes('Closed');
    }).map(function (u) {
      bot.sendMessage(msg.chat.id, u.id + ' ' + u.name);
    });
  }).catch(console.log);
  bot.sendMessage(msg.chat.id, 'Im work...');
});

bot.onText(/\/newLC (.+)/, function (msg, match) {
  var date = new Date();
  var fromId = msg.from.id;
  var blackList = msg.from.username === 'Tanichitto';
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
    return;
  }
  var resp = expa.get('https://gis-api.aiesec.org/v2/people.json', {
    'filters[home_committee]': match[1],
    'per_page': 100,
    'filters[registered][from]': date.toJSON().slice(0, 10)
  }).then(function (response) {
    if (response.data.length > 0) {
      bot.sendMessage(msg.chat.id, 'total ' + response.paging.total_items + ' at ' + date.toJSON());
      response.data.map(function (u) {
        return expa.get('people/' + u.id + '.json').then(function (user) {
          bot.sendMessage(msg.chat.id, '<a href="https://experience.aiesec.org/#/people/' + user.id + '" >' + user.full_name + '</a> ' + user.home_lc.name + ' ' + user.referral_type, {
            parse_mode: "HTML"
          });
        }).catch(console.log);
      });
    } else bot.sendMessage(msg.chat.id, 'Nothing new(');
  }).catch(console.log);
  bot.sendMessage(msg.chat.id, 'Im work...');
});

bot.onText(/\/newLCs (.+)/, function (msg, match) {
  var date = new Date();
  var fromId = msg.from.id;
  var blackList = msg.from.username === 'Tanichitto';
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
    return;
  }
  db.ref('newLC/' + match[1]).push(fromId).then(function (t) {
    return bot.sendMessage(msg.chat.id, 'you successfully subscribed to notifications');
  });
  bot.sendMessage(msg.chat.id, 'Im work...');
});

bot.onText(/\/myep (.+) (.+)/, function (msg, match) {
  var expa_ = (0, _wrapper2.default)(match[1], match[2]);
  var date = new Date();
  var fromId = msg.from.id;
  var blackList = msg.from.username === 'Tanichitto';
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
    return;
  }
  var resp = expa_.get('https://gis-api.aiesec.org/v2/people.json', {
    'filters[my]': true,
    'per_page': 100
  }).then(function (response) {
    if (response.data.length > 0) {
      bot.sendMessage(msg.chat.id, 'total ' + response.paging.total_items + ' at ' + date.toJSON());
      response.data.map(function (u) {
        return expa.get('people/' + u.id + '/applications.json').then(function (applications) {
          var relevant_apps = applications.data.filter(function (f) {
            return new Date(f.updated_at).toJSON().slice(0, 10) === date.toJSON().slice(0, 10);
          });
          if (relevant_apps.length > 0) {
            bot.sendMessage(msg.chat.id, '<a href="https://experience.aiesec.org/#/people/' + user.id + '" >' + user.full_name + '</a>\n                ' + u.country_code + u.phone + '\n                ' + applications.data.map(function (a) {
              a.status + ' at <a href="https://experience.aiesec.org/#/people/' + a.opportunity.id + '">' + a.opportunity.title + '</a>\n';
            }), {
              parse_mode: "HTML"
            });
          }
        }).catch(console.log);
      });
    } else bot.sendMessage(msg.chat.id, 'Nothing new(');
  }).catch(console.log);
  bot.sendMessage(msg.chat.id, 'Im work...');
});
bot.onText(/\/lcep (.+)/, function (msg, match) {
  var date = new Date();
  var blackList = msg.from.username === 'Tanichitto';
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
    return;
  }
  var resp = expa_.get('https://gis-api.aiesec.org/v2/people.json', {
    'filters[home_committee]': match[1],
    'per_page': 100
  }).then(function (response) {
    if (response.data.length > 0) {
      var i = 0;
      response.data.map(function (u) {
        return expa.get('people/' + u.id + '/applications.json').then(function (applications) {
          var relevant_apps = applications.data.filter(function (f) {
            return new Date(f.updated_at).toJSON().slice(0, 10) === date.toJSON().slice(0, 10);
          });
          if (relevant_apps.length > 0) {
            bot.sendMessage(msg.chat.id, '<a href="https://experience.aiesec.org/#/people/' + user.id + '" >' + user.full_name + '</a>\n                  ' + u.country_code + u.phone + '\n                  ' + applications.data.map(function (a) {
              a.status + ' at <a href="https://experience.aiesec.org/#/opportunities/' + a.opportunity.id + '">' + a.opportunity.title + '</a>\n';
            }), {
              parse_mode: "HTML"
            });
            i++;
          }
        });
      }).then(function (t) {
        return bot.sendMessage(msg.chat.id, 'total changes ' + i + ' at ' + date.toJSON());
      }).catch(console.log);
    } else bot.sendMessage(msg.chat.id, 'Nothing new(');
  }).catch(console.log);
  bot.sendMessage(msg.chat.id, 'Im work...');
});

bot.onText(/\/lceps (.+)/, function (msg, match) {
  var date = new Date();
  var fromId = msg.from.id;
  var blackList = msg.from.username === 'Tanichitto';
  if (blackList) {
    bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
    return;
  }
  db.ref('lcep/' + match[1]).push(fromId).then(function (t) {
    return bot.sendMessage(msg.chat.id, 'you successfully subscribed to notifications');
  });
  bot.sendMessage(msg.chat.id, 'Im work...');
});

bot.onText(/\/applicants (.+) (.+) (.+)/, function (msg, match) {
  try {
    var date = new Date();
    var fromId = msg.from.id;
    var blackList = msg.from.username === 'Tanichitto';
    if (blackList) {
      bot.sendMessage(msg.chat.id, 'user not allowed to make this request');
      return;
    }
    var resp = match[1].split(',').map(function (id) {
      expa_.get('https://experience.aiesec.org/#/opportunities/' + id + '/applications', {
        'filters[home_committee]': match[1],
        'per_page': 100
      }).then(function (response) {
        var applicants = response.data.filter(function (f) {
          return (!match[2] || new Date(f.created_at) >= match[2]) && (!match[3] || new Date(f.created_at) <= match[3]);
        });
        if (applicants.length > 0) {
          applicants.map(function (u) {
            expa.get('opportunities/' + id + '/applicant.json?person_id=' + u.person.id).then(function (applicant) {
              bot.sendMessage(msg.chat.id, '<a href="https://experience.aiesec.org/#/opportunities/' + id + '/applicant.json?person_id=' + u.person.id + '" >' + applicant.full_name + '</a> \n                  +' + applicant.contact_info.country_code + applicant.contact_info.phone + '\n                  ' + aplicant.home_lc.country + '\n                  ' + u.status + '\n                  ' + (applicant.managers[0] ? '<a href=\'mailto:' + applicant.managers[0].email + '\'>' + applicant.managers[0].full_name + '</a> \n                  +' + applicant.managers[0].contact_info.country_code + applicant.managers[0].contact_info.phone + ' ' : 'no managers'), {
                parse_mode: "HTML"
              });
            });
          });
        } else bot.sendMessage(msg.chat.id, 'Nothing new for ' + id + '(');
      }).catch(function (e) {
        return bot.sendMessage(msg.chat.id, e.message);
      });
    });
    bot.sendMessage(msg.chat.id, 'Im work...');
  } catch (e) {
    bot.sendMessage(msg.chat.id, e.message);
  }
});

bot.onText(/\/start/, function (msg) {
  bot.sendMessage(msg.chat.id, "Welcome");
});
bot.onText(/\/hello/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = 'hello, dear ' + msg.from.first_name + '\n  Commands:\n  /newMC - return all users who registered today on GMT time in AIESEC Russia\n  /newMCs - subscribe to all users who registered today on GMT time in AIESEC Russia\n  /lc - return list of LC with name and Id\n  /newLC <LC id> - return all users who registered today (on GMT time) at LC with id\n  /newLCs <LC id>- subscribe to all users who registered today (on GMT time) at LC with id\n  /myep <login> <password> - return your eps with changed state\n  /lcep <LC id> - return eps with changed state for LC id\n  /lceps <LC id> - subscribe to eps with changed state for LC id\n  /applicants <TN ids separate by \',\'> <start date> <end date> - return applicants for TNs, who was applied between start and end dates(YYYY-MM-DD)';
  bot.sendMessage(fromId, resp);
});