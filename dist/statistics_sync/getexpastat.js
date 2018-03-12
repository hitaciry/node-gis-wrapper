'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatistics = exports.getLCs = undefined;

var _wrapper = require('../wrapper.js');

var _wrapper2 = _interopRequireDefault(_wrapper);

var _credentials = require('../credentials');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expa = (0, _wrapper2.default)(_credentials.expaCredential.login, _credentials.expaCredential.password);

var getLCs = expa.get('https://gis-api.aiesec.org/v2/committees/1618.json').then(function (response) {
  return response.suboffices.filter(function (f) {
    return !f.name.includes('Closed');
  }).map(function (u) {
    return {
      id: u.id,
      name: u.name
    };
  });
}).catch(console.log);

var getStatistics = function getStatistics(startDate, endDate, program, type) {
  return expa.get('https://gis-api.aiesec.org/v2/applications/analyze.json', {
    "basic[home_office_id]": 1618,
    "basic[type]": type,
    "end_date": endDate,
    "programmes[]": program,
    "start_date": startDate
  }).then(function (response) {
    return {
      program: program,
      type: type,
      facts: response.analytics.children.buckets };
  }).catch(console.log);
};

exports.getLCs = getLCs;
exports.getStatistics = getStatistics;