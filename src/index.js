import express  from 'express'
import EXPA from "./wrapper"
import bodyParser from 'body-parser'

const app= express();
let expa =null;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
})

app.post("/token",bodyParser.urlencoded({ extended: true }), function (req, res, next) {
  expa= EXPA(req.body.email,req.body.password)
 expa.getToken()
  .then(t=>{console.log(t);res.send(t);next()})
  .catch(e=>{console.log(e);res.send(e)})
})
app.post("/request", function (req, res) {
  const login = 'a.shitikov90@gmail.com'
  const password = 'hitaciry90'
  EXPA(login,password).get(req.body.url,req.body).then(res.send.json()).catch(res.send)
})
app.get("/",(req, res)=>res.send("I'm working"))
