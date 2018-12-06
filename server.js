const express = require('express');
const knex = require('knex');

const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];

const database = knex(config);
const app = express();

// * GET /api/v1/ingredients
// * GET /api/v1/ingredients/:id/recipes
// * GET /api/v1/recipes
// * GET /api/v1/recipes/:id/ingredients
// * GET /api/v1/recipes/:recipe_id/steps
// * POST /api/v1/recipes/:recipe_id/steps
// * POST /api/v1/recipes
// * PUT /api/v1/recipes/:id
// PUT /api/v1/recipes/:recipe_id/steps/:step_num
// * DELETE /api/v1/recipes/:id
// * DELETE /api/v1/recipes/:recipe_id/steps/

app.use(express.json());
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
      const recipe_id = recipeIds[0];
      const ingredientIds = await Promise.all(
        ingredients.map(ingredient =>
          database('ingredients').insert({ ingredient_name: ingredient }, 'id'),
        ),
      );
      await Promise.all(
        ingredientIds.map(id =>
          database('recipe_ingredients').insert(
            { ingredient_id: id[0], recipe_id },
            'id',
          ),
        ),
      );
      await Promise.all(
        steps.map(step_text =>
          database('recipe_steps').insert({ step_text, recipe_id }, 'id'),
        ),
      );
      res
        .status(201)
        .json({ message: `Recipe ${recipe_name} inserted, id ${recipe_id}` });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
});

app.put('/api/v1/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const recipe = req.body;

  try {
    const newRecipeIds = await database('recipes')
      .where('id', id)
      .update(recipe, 'id');
    if (!newRecipeIds.length) {
      res.status(404).json({ message: `recipe with id ${id} does not exist.` });
    } else {
      res.status(200).json({
        message: `Success! Record with id ${id} updated with ${recipe}.`,
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.delete('/api/v1/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ingredientIds = await database('recipe_ingredients')
      .where('recipe_id', id)
      .select();

    if (!ingredientIds.length) {
      res.status(404).json({
        message: `No recipe id${id} found`,
      });
      return;
    }

    await database('recipe_ingredients')
      .where('recipe_id', id)
      .del();

    await Promise.all(
      ingredientIds.map(ingredient =>
        database('ingredients')
          .where('id', ingredient.ingredient_id)
          .del(),
      ),
    );

    await database('recipe_steps')
      .where('recipe_id', id)
      .del();

    await database('recipes')
      .where('id', id)
      .del();
    res.status(204).json({ message: `Successfully deleted recipe id ${id}` });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get('/api/v1/ingredients/:id/recipes', async (req, res) => {
  const { id } = req.params;

  try {
    const recipeReferences = await database('recipe_ingredients')
      .where('ingredient_id', id)
      .select();
    if (!recipeReferences.length) {
      res.status(404).json({
        message: `ingredient with id ${id} does not exist please try harder`,
      });
      return;
    }
    const recipes = await Promise.all(
      recipeReferences.map(reference => {
        const { recipe_id } = reference;
        return database('recipes')
          .where('id', recipe_id)
          .select();
      }),
    );
    res.status(200).json(...recipes);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get('/api/v1/recipes/:id/steps', async (req, res) => {
  const { id } = req.params;

  try {
    const steps = await database('recipe_steps')
      .where('recipe_id', id)
      .select();
    if (!steps.length) {
      res.status(404).json({ message: `No steps found for recipe id${id}` });
      return;
    }
    res.status(200).json({ steps });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post('/api/v1/recipes/:id/steps', async (req, res) => {
  const { id } = req.params;
  const { step_text } = req.body;

  if (!step_text) {
    res.status(422).json({ message: 'Missing parameter step_text' });
    return;
  }

  try {
    const recipeId = await database('recipes')
      .where('id', id)
      .select();
    if (!recipeId.length) {
      res.status(404).json({ message: `Recipe with id ${id} not found` });
      return;
    }
    const step = await database('recipe_steps').insert(
      { step_text, recipe_id: id },
      'id',
    );
    res.status(201).json({
      message: `Created new step for recipe id ${id} at step id ${step}`,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.delete('/api/v1/recipes/:id/steps', async (req, res) => {
  const { id } = req.params;

  try {
    const steps = await database('recipe_steps')
      .where('recipe_id', id)
      .select();
    if (!steps.length) {
      res.status(404).json({ message: `Recipe with id ${id} not found` });
      return;
    }
    await database('recipe_steps')
      .where('recipe_id', steps[steps.length - 1].recipe_id)
      .del();
    res
      .status(204)
      .json({ message: `Recipe id ${id} step #${steps.length} deleted` });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.put('/api/v1/recipes/:recipe_id/steps/:step_num', async (req, res) => {
  const { recipe_id, step_num } = req.params;
  const { step_text } = req.body;

  if (!step_text) {
    res.status(422).json({ message: 'You are missing the data for the step_text' });
    return;
  }

  try {
    const stepIds = await database('recipe_steps').where('recipe_id', recipe_id).select();

    if (!stepIds.length || !stepIds[step_num]) {
      res.status(404).json({ message: `Recipe with id${recipe_id} does not exist` });
      return;
    }
    await database('recipe_steps').where('id', stepIds[step_num].id).update({ step_text });

    res.status(204).json({ message: `Successfully updated step${step_num}` });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get('/api/v1/recipes/:id/ingredients', async (req, res) => {
  const { id } = req.params;

  try {
    const ingredientIds = await database('recipe_ingredients').where('recipe_id', id).select();
    if (!ingredientIds.length) {
      res.status(404).json({ message: `Recipe with id${id} does not exist.` });
      return;
    }
    const ingredients = await Promise.all(ingredientIds.map(ingredient => database('ingredients').where('id', ingredient.ingredient_id).select()));
    res.status(200).json({ ingredients });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`);
});

module.exports = app;
