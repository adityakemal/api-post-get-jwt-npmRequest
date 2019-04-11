const express = require('express')
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')
//buat ferifier token di pakai jadi middleware nantinya
const jwtVerifier = require('express-jwt')
const bodyParser = require('body-parser')
var app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())


var user = { username : 'admin', password : 'admin123'}

var secret = 'secret'
//bikin token
function createToken(){
  let expirationDate = Math.floor(Date.now()/1000) + 3000 //30 for 30 dtik dari pas masuk
  // bikin tokennya bedasarkan username
  var token = jwt.sign({userId : user.username, exp : expirationDate}, secret )
  return token
}


//create jwt
app.post('/api/login', (req,res)=>{
  if (req.body.username === user.username && req.body.password === user.password) {
    res.json({
      token :createToken()
    })
    
  }else {
    res.sendStatus(400)
  }
})
//get with jwt
app.get('/',jwtVerifier({secret : 'secret'}),(req,res)=>{
  var data = {
    data : req.token
  }
  res.json({
    message: 'aya nao iyeu meni rame',
  })
})

// post seccuring
app.post('/testpost', jwtVerifier({secret:'secret'}), (req, res) => {
  var t = {
    test : req.body.test
  }
console.log(t);
})

// error handle by express
app.use((err, req, res, next)=>{
  if (err.name == "UnauthorizedError") {
    res.status(500).send(err.message)
    console.log('login lg');
    console.log('goblok');
  }
})

var port = process.env.PORT || "3000"
app.listen(port , ()=> console.log('======== SERVE RUN =======', port))
