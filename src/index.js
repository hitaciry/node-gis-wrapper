import express  from 'express'
import EXPA from "./wrapper"
import bodyParser from 'body-parser'

const app= express();

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
  console.log(req.headers)
  EXPA(req.body.email,req.body.password).getToken()
  .then(t=>{console.log(t);res.send(t);next()})
  .catch(e=>{console.log(e);res.send(e)})
})

app.get("/",(req, res)=>res.send("I'm working"))
