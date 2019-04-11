const express = require('express')
const verify = require('express-jwt')
const request = require('request')
const bodyParser = require('body-parser')

var client = express()

client.use(bodyParser.urlencoded({
  extended: false
}))
client.use(bodyParser.json())

var initoken = ''
//login ke server ntar di kasih token
client.post('/login', (req, res) => {
  let url = "http://localhost:8000/api/login"
  var form = {
    username: req.body.username,
    password: req.body.password
  }
  request.post({
    url: url,
    form
  }, (err, httpResponse, body) => {
    if (err) {
      console.log(err);
    } else {
      res.send(body)
      var t = JSON.parse(body).token
      initoken += t
    }
  })
})

console.log(initoken);

client.post('/test', (req, res) => {
  let url = "http://localhost:8000/testpost"
  var form = {
    test: req.body.test,
  }
  var accessToken = initoken
  request({
    url: url,
    method: 'POST',
    auth: {
      bearer: accessToken
    },
    form: {
      test: 'client_credentials'
    }
  }, function(err, response, body) {
      console.log(response);
      console.log(body);
  });
})



client.get('/home', (req, res) => {

  var url = "http://localhost:8000/"
  request.get(url, {
    auth: {
      bearer: initoken
    }
  }, (err, response, body) => {
    if (err) {
      console.log('errrrr', err);
      console.log('maybe expire');
    } else {
      console.log(body);
      res.send(body)
    }

  })
})

// error handle by express
client.use((err, req, res, next) => {
  if (err.name == "UnauthorizedError") {
    res.status(500).send(err.message)
    console.log('login lg');
    console.log('goblok');
  }
})

client.listen(8080, () => {
  console.log('===== CLIENT RUN IN 8080 =====');
})
