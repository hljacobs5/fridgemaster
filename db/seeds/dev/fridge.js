const mockRecipes = [
  {
    recipe_name: 'chicken pot pie',
    ingredients: [
      'chicken',
      'carrots',
      'peas',
      'pie crust',
      'gravy'
    ],
    steps: [
      'cook the chicken',
      'make the rest of the pot pie'
    ]
  },
  {
    recipe_name: 'pot roast',
    ingredients: [
      'pot roast',
      'nice taters',
      'gravy',
      'carrots'
    ],
    steps: [
      'open crockpot',
      'insert potatoes',
      'insert pot roast',
      'yay! you did it'
    ]
  }
]
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 1, colName: 'rowValue1'},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
};
