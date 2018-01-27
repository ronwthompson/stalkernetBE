require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const request = require('request')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/ping', (req, res, next) => {
    console.log("Hi!  This route is working.")
    res.send('hello')
})

const users = require('./src/routes/users')
app.use('/api/users', users)

const auth = require('./src/routes/auth');
app.use('/auth', auth)

const faces = require('./src/routes/faces');
app.use('/faces', faces)

app.use((req, res) => {
  const status = 404;
  const message = `Could not ${req.method} ${req.path}`;
  res.status(status).json({ status, message });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  res.status(status).json({ message, status });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('listening on port', port);
});
