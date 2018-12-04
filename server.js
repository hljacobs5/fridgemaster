const express = require('express');
const bodyParser = require('body-parser');
const environment = process.env.NODE || 'development';
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration);
const app = express();

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);

app.get('/api/v1/ingredients', (req, res) => {
  res.status(200).json({});
});

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`);
});

app.use(bodyParser.json());

module.exports = app;
