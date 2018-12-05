const express = require('express');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment]
const database = require('knex')(config);
const app = express();

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);

app.get('/api/v1/ingredients', (req, res) => {
  database('ingredients').select()
    .then(ingredients => {
      res.status(200).json(ingredients)
    })
    .catch(error => res.json(error))
});

app.get('/api/v1/recipes', (req, res) => {
  database('recipes').select()
    .then(recipes => {
      res.status(200).json(recipes)
    })
    .catch(error => res.json(error))
})

app.post('/api/v1/recipes', (req, res) => {
  const recipe = req.body

  let missingProperties = []




  for(let key in recipe) {
    if(key !== 'recipe_name') {
      missingProperties = [...missingProperties, key]
    }
  }
  
  if (!recipe.recipe_name) {
    res.status(422).json({message: 'Missing parameter of recipe_name. {recipe_name: <STRING>}'})
  } else if(missingProperties.length) {
    res.status(422).json({message: `Extra properties of ${missingProperties} included.`})
  } else {
    database('recipes').insert(recipe, 'id')
      .then(recipeIds => {
        res.status(201).json({id: recipeIds[0]})
      })
      .catch(error => res.status(500).json(error))
  }

})

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`);
});

app.use(bodyParser.json());

module.exports = app;
