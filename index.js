import express  from 'express'
import EXPA from "./wrapper"

const app= express();

app.post("/token", function (req, res) {
  expa(req.body.email,req.body.password).getNewToken().then(res.send).catch(res.send)
})

app.get("/",(req, res)=>res.send("I'm working"))