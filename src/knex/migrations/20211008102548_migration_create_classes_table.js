exports.up = function (knex) {
  return knex.schema.createTable('classes', (table) => {
    table.increments().primary()
    table.timestamp('date').defaultTo(knex.fn.now())
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('comments')
    table.string('call_link', 255)
    table.boolean('is_submitted').notNullable().defaultTo(false)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('classes')
}
