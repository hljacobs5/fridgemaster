const express = require('express');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
const database = require('knex')(config);
const app = express();

// DONE GET /api/v1/ingredients
// GET /api/v1/ingredients/:id/recipes
// DONE GET /api/v1/recipes
// GET /api/v1/recipes/:id/ingredients
// GET /api/v1/recipes/:id/steps
// POST /api/v1/recipes/:id/steps
// DONE POST /api/v1/recipes
// PUT /api/v1/recipes/:id
// PUT /api/v1/recipes/:recipe_id/steps/:step_num
// DELETE /api/v1/recipes/:id
// DELETE /api/v1/recipes/:recipe_id/steps/

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);

app.get('/api/v1/ingredients', (req, res) => {
  database('ingredients')
    .select()
    .then(ingredients => {
      res.status(200).json(ingredients);
    })
    .catch(error => res.json(error));
});

app.get('/api/v1/recipes', (req, res) => {
  database('recipes')
    .select()
    .then(recipes => {
      res.status(200).json(recipes);
    })
    .catch(error => res.json(error));
});

app.post('/api/v1/recipes', async (req, res) => {
  const recipe = req.body;
  let missingProps = [];

  for (let requiredParam of ['recipe_name', 'steps', 'ingredients']) {
    if (!recipe[requiredParam]) {
      missingProps = [...missingProps, requiredParam];
    }
  }
  if (missingProps.length) {
    res.status(422).json({
      message: `Missing ${missingProps} parameters {recipe_name: <STRING>, steps: <ARRAY>, ingredients: <ARRAY>}`,
    });
  } else {
    try {
      const { recipe_name, ingredients, steps } = recipe
      console.log(recipe_name, ingredients, steps)
      const recipe_id = await database('recipes').insert(recipe_name, 'id');
      console.log(recipe_id)
      const ingredientIds = await Promise.all(
        ingedients.map(ingredient => {
          return database('ingredients').insert(ingredient, 'id');
        })
      );
      console.log(ingredientIds)
      const joinedIds = await Promise.all(
        ingredientIds.map(ingredient_id => {
          return database('recipe_ingredients').insert(
            {ingredient_id, recipe_id: recipe_id[0]},
            'id',
          );
        })
      );
      console.log(joinedIds)
      res
        .status(201)
        .json({message: `Recipe ${recipe.name} inserted, id ${recipe_id}`});
    } catch (error) {
      console.log(error)
      res.status(500).json({error});
    }
  }
});

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`);
});

app.use(bodyParser.json());

module.exports = app;
