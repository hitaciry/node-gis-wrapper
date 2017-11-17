'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _wrapper = require('./wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.post("/token", function (req, res) {
  (0, _wrapper2.default)(req.body.email, req.body.password).getNewToken().then(res.send).catch(res.send);
});
app.get("/", function (req, res) {
  return res.send("I'm working");
});