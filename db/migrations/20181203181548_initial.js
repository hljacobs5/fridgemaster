
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('ingredients', (table) => {
      table.increments('id').primary()
      table.string('ingredient_name')
      //table.string('something cool')
      table.timestamps(true, true)
    }),
    knex.schema.createTable('recipes', (table) => {
      table.increments('id').primary()
      table.string('recipe_name')
    })

  ])
};

exports.down = function(knex, Promise) {
  
};
