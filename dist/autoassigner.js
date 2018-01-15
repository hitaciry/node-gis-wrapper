'use strict';

var _wrapper = require('./wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//import * as serviceAccount from "db.json"


var login = 'a.shitikov90@gmail.com';
var password = 'hitaciry90';

var config = {
  apiKey: "7OlVhkAn0Q5NDiUeuK50MXhTCt9hqn7hRvSV5vyI",
  authDomain: "bot-db-935c6.firebaseapp.com",
  databaseURL: "https://bot-db-935c6.firebaseio.com"
};
var db = _firebase2.default.database(_firebase2.default.initializeApp(config));

var expa = (0, _wrapper2.default)(login, password);

var newLC = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var date, dbData;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            date = new Date();

            console.log('start');
            dbData = db.ref('LC').once('value', function (data) {
              return data;
            }).then(function (data) {
              data = data.val();
              console.log(Object.keys(data));
              Object.keys(data).forEach(function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(k) {
                  var all_ep, team, tl_id, team_members_ids, ep_per_member_count, today_ep, ep, min_index, assign_candidate, result;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          console.log('start for ' + k);
                          _context.next = 3;
                          return expa.get('https://gis-api.aiesec.org/v2/people.json', {
                            'filters[home_committee]': k,
                            'per_page': 10000
                          }).then(function (response) {
                            return response.data;
                          });

                        case 3:
                          all_ep = _context.sent;

                          console.log('all ep for ' + data[k].name + ' - ' + all_ep.length);
                          _context.next = 7;
                          return expa.get('https://gis-api.aiesec.org/v2/teams/' + data[k].ogx_group_id + '/positions.json').then(function (resp) {
                            return resp.data;
                          });

                        case 7:
                          team = _context.sent;

                          console.log('team', team);
                          tl_id = team.filter(function (f) {
                            return f.role === 'Team Leader';
                          }).id;
                          team_members_ids = team.filter(function (f) {
                            return f.role !== 'Team Leader';
                          }).reduce(function (last, cur) {
                            return last.push(cur.id);
                          }, []);
                          ep_per_member_count = all_ep.reduce(function (last, current) {
                            if (current.managers) {
                              current.managers.foreach(function (f) {
                                if (team_members_ids.includes(f.id)) {
                                  last[team_members_ids.indexOf(f.id)]++;
                                }
                              });
                            }
                            return last;
                          }, new Array(team_members_ids.length));
                          //member with min number of EPs

                          today_ep = all_ep.filter(function (f) {
                            return f.created_at.slice(0, 10) === date.toJSON().slice(0, 10) && f.managers.length === 0;
                          });
                          _context.t0 = regeneratorRuntime.keys(today_ep);

                        case 14:
                          if ((_context.t1 = _context.t0()).done) {
                            _context.next = 24;
                            break;
                          }

                          ep = _context.t1.value;
                          min_index = ep_per_member_count.indexOf(Math.min.apply(Math, _toConsumableArray(ep_per_member_count)));
                          assign_candidate = team_members_ids[min_index];

                          ep_per_member_count[min_index]++;
                          _context.next = 21;
                          return expa.patch('https://gis-api.aiesec.org/v2/people.json', {
                            person: {
                              "manager_ids": [tl_id, assign_candidate]
                            }
                          });

                        case 21:
                          result = _context.sent;
                          _context.next = 14;
                          break;

                        case 24:
                          console.log('done');

                        case 25:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined);
                }));

                return function (_x) {
                  return _ref2.apply(this, arguments);
                };
              }());
            });

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function newLC() {
    return _ref.apply(this, arguments);
  };
}();

newLC();