
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('ingredients', (table) => {
      table.increments('id').primary()
      table.string('ingredient_name')
      table.string('aisle')
      table.timestamps(true, true)
    }),
    knex.schema.createTable('recipes', (table) => {
      table.increments('id').primary()
      table.string('recipe_name')
      table.timestamps(true, true)
    }),
    knex.schema.createTable('recipe_ingredients', (table) => {
      table.increments('id').primary()
      table.integer('recipe_id').unsigned()
      table.foreign('recipe_id')
        .references('recipes.id')
      table.integer('ingredient_id').unsigned()
      table.foreign('ingredient_id')
        .references('ingredients.id')
      table.timestamps(true, true)
    }),
    knex.schema.createTable('recipe_steps', (table) => {
      table.increments('id').primary()
      table.integer('step_num').unsigned()
      table.string('step_text')
      table.integer('recipe_id').unsigned()
      table.foreign('recipe_id')
        .references('recipes.id')
      table.timestamp(true, true)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('recipe_steps'),
    knex.schema.dropTable('recipe_ingredients'),
    knex.schema.dropTable('recipes'),
    knex.schema.dropTable('ingredients')
  ])
};
