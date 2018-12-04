const express = require('express');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment]
const database = require('knex')(config);
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
