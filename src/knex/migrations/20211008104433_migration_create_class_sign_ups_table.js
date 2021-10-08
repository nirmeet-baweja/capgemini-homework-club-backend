exports.up = function (knex) {
  return knex.schema.createTable('class_sign_ups', (table) => {
    table.primary(['class_id', 'user_id'], 'id')
    table.integer('class_id').references('id').inTable('classes')
    table.integer('user_id').references('id').inTable('users')
    table.boolean('is_present').notNullable().defaultTo(true)
    table.boolean('is_cancelled').notNullable().defaultTo(false)
    table.string('comments', 255)
    table.string('remarks', 255)
    table.integer('group_id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('class_sign_ups')
}