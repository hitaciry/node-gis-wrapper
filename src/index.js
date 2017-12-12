import express  from 'express'
import EXPA from './wrapper'

const app= express();
app.set('port', (process.env.PORT || 5000))

app.post("/token", function (req, res) {
  console.log(req.body)
  EXPA(req.body.email,req.body.password).getNewToken().then(res.send).catch(res.send)
})
app.post("/request", function (req, res) {
  const login = 'a.shitikov90@gmail.com'
  const password = 'hitaciry90'
  EXPA(login,password).get(req.body.url,req.body).then(res.send.json()).catch(res.send)
})
app.get("/",(req, res)=>res.send("I'm working"))

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})