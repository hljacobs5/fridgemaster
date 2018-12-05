const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');

const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];

const database = knex(config);
const app = express();

// * GET /api/v1/ingredients
//  GET /api/v1/ingredients/:id/recipes
// * GET /api/v1/recipes
// GET /api/v1/recipes/:id/ingredients
// GET /api/v1/recipes/:id/steps
// POST /api/v1/recipes/:id/steps
// * POST /api/v1/recipes
// PUT /api/v1/recipes/:id
// PUT /api/v1/recipes/:recipe_id/steps/:step_num
// DELETE /api/v1/recipes/:id
// DELETE /api/v1/recipes/:recipe_id/steps/

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);

app.get('/api/v1/ingredients', async (req, res) => {
  try {
    const ingredients = await database('ingredients').select();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get('/api/v1/recipes', async (req, res) => {
  try {
    const recipes = await database('recipes').select();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post('/api/v1/recipes', async (req, res) => {
  const recipe = req.body;
  let missingProps = [];

  ['recipe_name', 'steps', 'ingredients'].forEach(requiredParam => {
    if (!recipe[requiredParam]) {
      missingProps = [...missingProps, requiredParam];
    }
  });
  if (missingProps.length) {
    res.status(422).json({
      message: `Missing ${missingProps} parameters {recipe_name: <STRING>, steps: <ARRAY>, ingredients: <ARRAY>}`,
    });
  } else {
    try {
      const { recipe_name, ingredients, steps } = recipe;
      const recipeIds = await database('recipes').insert({ recipe_name }, 'id');
      const recipe_id = recipeIds[0]
      const ingredientIds = await Promise.all(
        ingredients.map(ingredient =>
          database('ingredients').insert({ ingredient_name: ingredient }, 'id'),
        ),
      );
      await Promise.all(
        ingredientIds.map(id =>
          database('recipe_ingredients').insert(
            { ingredient_id: id[0], recipe_id: recipe_id },
            'id',
          ),
        ),
      );
      await Promise.all(
        steps.map((step_text, step_num) => {
          return database('recipe_steps').insert({step_num, step_text, recipe_id}, 'id')
        }));
      res
        .status(201)
        .json({ message: `Recipe ${recipe_name} inserted, id ${recipe_id}` });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
});

app.get('/api/v1/ingredients/:id/recipes', async (req, res) => {
  const { id } = req.params

  try {
    const recipeReferences = await database('recipe_ingredients').where('ingredient_id', id).select()
    if(!recipeReferences.length) {
      res.status(404).json({message: `ingredient with id ${id} does not exist please try harder`})
      return
    }
    const recipes = await Promise.all(recipeReferences.map(reference => {
      const { recipe_id } = reference
      return database('recipes').where('id', recipe_id).select()
    }))
    res.status(200).json(...recipes)
  } catch (error) {
    res.status(500).json({error})
  }
})

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`);
});

app.use(bodyParser.json());

module.exports = app;
