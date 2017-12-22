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

var peopleReq = function peopleReq(chatIds, response, date) {
  chatIds.forEach(function (id) {
    if (response.data.length > 0) {
      bot.sendMessage(id, 'total ' + response.paging.total_items + ' at ' + date.toJSON());
      response.data.map(function (u) {
        return expa.get('people/' + u.id + '.json').then(function (user) {
          bot.sendMessage(id, '<a href="https://experience.aiesec.org/#/people/' + user.id + '" >' + user.full_name + '</a> ' + user.home_lc.name + ' ' + user.referral_type, {
            parse_mode: "HTML"
          });
        }).catch(console.log);
      });
    } else bot.sendMessage(id, 'Nothing new(');
  });
};

var newMC = function newMC() {
  var date = new Date();
  var dbData = db.ref('newMC').once('value', function (data) {
    return data.val();
  }).then(function (data) {
    var resp = expa.get('https://gis-api.aiesec.org/v2/people.json', {
      'filters[home_committee]': 1618,
      'per_page': 100,
      'filters[registered][from]': date.toJSON().slice(0, 10)
    }).then(function (response) {
      peopleReq(data[k], response, date);
    }).catch(console.log);
  });
};

var newLC = function newLC() {
  var date = new Date();

  var dbData = db.ref('newLC').once('value', function (data) {
    return data.val();
  }).then(function (data) {
    Object.keys(data).forEach(function (k) {
      var resp = expa.get('https://gis-api.aiesec.org/v2/people.json', {
        'filters[home_committee]': k,
        'per_page': 100,
        'filters[registered][from]': date.toJSON().slice(0, 10)
      }).then(function (response) {
        peopleReq(data[k], response, date);
      }).catch(console.log);
    });
  });
};

var lcep = function lcep() {
  var date = new Date();
  var dbData = db.ref('lcep').once('value', function (data) {
    return data.val();
  }).then(function (data) {
    Object.keys(data).forEach(function (k) {
      var resp = expa.get('https://gis-api.aiesec.org/v2/people.json', {
        'filters[home_committee]': k,
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
                data.forEach(function (id) {
                  return bot.sendMessage(id, '<a href="https://experience.aiesec.org/#/people/' + user.id + '" >' + user.full_name + '</a>\n                      ' + u.country_code + u.phone + '\n                      ' + applications.data.map(function (a) {
                    a.status + ' at <a href="https://experience.aiesec.org/#/opportunities/' + a.opportunity.id + '">' + a.opportunity.title + '</a>\n';
                  }), {
                    parse_mode: "HTML"
                  });
                });
                i++;
              }
            });
          }).then(function (t) {
            return data.forEach(function (id) {
              return bot.sendMessage(id, 'total changes ' + i + ' at ' + date.toJSON());
            });
          }).catch(console.log);
        } else data.forEach(function (id) {
          return bot.sendMessage(id, 'Nothing new(');
        });
      });
    }).catch(console.log);
  });
};

lcep();
newMC();
newLC();