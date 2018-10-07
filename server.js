const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Database
const mongoUrl = process.env.MONGO_DB;
mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => {
   console.log('DB connected!');
});
db.on('error', (err) => {
  console.log('DB ERROR:', err);
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  // Access-Control-Allow-Origin: 요청이 허용되는 url을 route을 제외하고 적습니다. 이외의 url로 부터 오는 요청은 거절됩니다. 단 *은 모든 요청을 허가시킵니다.
  res.header('Access-Control-Allow-Origin', '*');
  // Access-Control-Allow-Methods:요청이 허용되는 HTTP verb 목록을 적습니다. 여기에 포함되지 않은 HTTP verb의 요청은 거절됩니다. *을 사용할 수 없습니다.
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // Access-Control-Allow-Headers: 요청이 허용되는 HTTP header 목록을 적습니다. 여기에 포함되지 않은 HTTP header는 사용할 수 없습니다.  *을 사용할 수 없습니다.
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
  next();
});

// API

// Server
const port = 3000;
app.listen(port, function(){
  console.log('listening on port:' + port);
});