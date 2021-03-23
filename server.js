const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');

const httpPort = 80;

const app = express();

app.use('/', indexRouter);
app.use(express.static(path.join(__dirname, 'public'),{
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'max-age=31536000');
    }
  }
}))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'))
})

app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});