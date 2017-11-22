'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _wrapper = require('./wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.post("/token", _bodyParser2.default.urlencoded({ extended: true }), function (req, res, next) {
  console.log(req.headers);
  (0, _wrapper2.default)(req.body.email, req.body.password).getToken().then(function (t) {
    console.log(t);res.send(t);next();
  }).catch(function (e) {
    console.log(e);res.send(e);
  });
});

app.get("/", function (req, res) {
  return res.send("I'm working");
});