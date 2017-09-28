import express  from 'express'
import EXPA from "./wrapper"

const app= express();

app.post("/token", function (req, res) {
  res.send(expa(req.body.email,req.body.password).getNewToken().then(console.log).catch(console.log))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})