const mockRecipes = [
  {
    recipe_name: 'chicken pot pie',
    ingredients: ['chicken', 'carrots', 'peas', 'pie crust', 'gravy'],
    steps: ['cook the chicken', 'make the rest of the pot pie'],
  },
  {
    recipe_name: 'pot roast',
    ingredients: ['pot roast', 'nice taters', 'gravy', 'carrots'],
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
        const ingredientIds = await Promise.all(
          recipe.ingredients.map(ingredient =>
            createIngredient(knex, ingredient),
          ),
        );
        const joinedIds = await Promise.all(
          ingredientIds.map(id => joinIngredients(knex, id, recipeId)),
        );
      });
      return Promise.all(recipePromises);
    });
};

function createRecipe(knex, recipe) {
  return knex('recipes').insert({recipe_name: recipe.name}, 'id');
}

function createIngredient(knex, ingredient) {
  return knex('ingredients').insert({ingredient_name: ingredient});
}

function joinIngredients(knex, ingredient_id, recipe_id) {
  return knex('recipe_ingredients').insert({ingredient_id, recipe_id});
}
