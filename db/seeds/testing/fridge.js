/*eslint-disable*/
const mockRecipes = [
  {
    recipe_name: 'chicken pot pie',
    ingredients: [
      { ingredient_name: 'chicken', aisle: 'meat' },
      { ingredient_name: 'carrots', aisle: 'produce' },
      { ingredient_name: 'peas', aisle: 'produce' },
      { ingredient_name: 'pie crust', aisle: 'produce' },
      { ingredient_name: 'gravy', aisle: 'produce' },
    ],
    steps: ['cook the chicken', 'make the rest of the pot pie'],
  },
  {
    recipe_name: 'pot roast',
    ingredients: [
      { aisle: 'gravy', ingredient_name: 'pot roast' },
      { aisle: 'gravy', ingredient_name: 'nice taters' },
      { aisle: 'gravy', ingredient_name: 'gravy' },
      { aisle: 'gravy', ingredient_name: 'carrots' },
    ],
    steps: [
      'open crockpot',
      'insert potatoes',
      'insert pot roast',
      'yay! you did it',
    ],
  },
];
exports.seed = function(knex, Promise) {
  return knex('recipe_steps')
    .del()
    .then(() => knex('recipe_ingredients').del())
    .then(() => knex('recipes').del())
    .then(() => knex('ingredients').del())
    .then(() => {
      const recipePromises = mockRecipes.map(async recipe => {
        const recipeId = await createRecipe(knex, recipe);
        await Promise.all(
          recipe.steps.map((step, index) =>
            createSteps(knex, step, recipeId[0]),
          ),
        );
        const ingredientIds = await Promise.all(
          recipe.ingredients.map(ingredient =>
            createIngredient(knex, ingredient),
          ),
        );
        const joinedIds = await Promise.all(
          ingredientIds.map(id => joinIngredients(knex, id[0], recipeId[0])),
        );
      });
      return Promise.all(recipePromises);
    })
    .catch(error => console.log(error));
};

function createRecipe(knex, recipe) {
  return knex('recipes').insert({ recipe_name: recipe.recipe_name }, 'id');
}

function createIngredient(knex, ingredient) {
  const { ingredient_name, aisle } = ingredient;
  return knex('ingredients').insert({ ingredient_name, aisle }, 'id');
}

function joinIngredients(knex, ingredient_id, recipe_id) {
  return knex('recipe_ingredients').insert({ ingredient_id, recipe_id }, 'id');
}

function createSteps(knex, step_text, recipe_id) {
  return knex('recipe_steps').insert({ step_text, recipe_id }, 'id');
}
