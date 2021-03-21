const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');

const httpPort = 80;

const app = express();

app.use('/', indexRouter);
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'))
})

app.listen(httpPort, function () {
  console.log(`Listening on port ${httpPort}!`)
})