
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', GetToken);      
})
function  GetToken () {
  var email = document.getElementById('email').value
  console.log(email)
  var password = document.getElementById('password').value
  console.log(password)
  var result = document.getElementById('result')
  var myHeaders = new Headers()
  var body= {
      "password": password,
      "email":email
    }
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
  myHeaders.append("Accept","*/*")
  myHeaders.append("Accept-Encoding","gzip, deflate, br")
  myHeaders.append("Accept-Language","en-US,en;q=0.8")
  myHeaders.append("Cache-Control","no-cache")
  myHeaders.append("Connection","keep-alive")
  fetch("https://protected-mesa-32089.herokuapp.com/token",{
    method:"POST",
    body:Object.keys(body).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(body[k])}`).join('&'),
    mode:"cors",
    headers: myHeaders
  })
      .then(r=>r.text())
      .then(token=>{console.log(token);result.value=token})
      .catch(console.log)
}