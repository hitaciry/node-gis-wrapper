'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _wrapper = require('.wrapper.js');

var expa = _interopRequireWildcard(_wrapper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.post("/token", function (req, res) {
  res.send(expa(req.body.email, req.body.password).getNewToken().then(console.log).catch(console.log));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
