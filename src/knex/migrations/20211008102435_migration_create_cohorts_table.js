exports.up = function (knex) {
  return knex.schema.createTable('cohorts', (table) => {
    table.increments().primary()
    table.string('name', 255).notNullable()
    table.boolean('is_active').notNullable().defaultTo(true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('cohorts')
}
