/*eslint-disable*/
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('recipe_steps', table => {
      table.dropColumn('step_num');
    })
  ]);

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('recipe_steps', table => {
      table.integer('recipe_steps');
    })
  ]);

};
