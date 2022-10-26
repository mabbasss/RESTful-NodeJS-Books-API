const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const username = 'dbUser';
const password = 'dev1234';
const cluster = 'globomantics.wzbysdf';

if (process.env.ENV === 'Test') {
  // eslint-disable-next-line no-console
  console.log('This is a Test');
  const dbName = 'BooksDB_Test';
  const url = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  mongoose.connect(url);
  // mongoose.connect('mongodb://localhost:27017/BooksDb_test');
} else {
  // eslint-disable-next-line no-console
  console.log('This is the real DB');
  const dbName = 'BooksDB';
  const url = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  mongoose.connect(url);
  // mongoose.connect('mongodb://localhost:27017/BooksDb');
}

const port = process.env.PORT || 3000;
const bookRouter = require('./routers/bookRouter');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my NODEMON API!');
});

app.server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Running on port ${port}`);
});

module.exports = app;
