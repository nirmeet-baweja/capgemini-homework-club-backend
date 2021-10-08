exports.up = function (knex) {
  return knex.schema.createTable('cohorts', (table) => {
    table.increments().primary()
    table.string('name', 255).notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('cohorts')
}
