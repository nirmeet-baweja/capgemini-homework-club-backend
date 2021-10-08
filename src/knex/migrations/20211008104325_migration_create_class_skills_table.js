exports.up = function (knex) {
  return knex.schema.createTable('user_skills', (table) => {
    table.primary(['class_id', 'skill_id'], 'id')
    table.integer('class_id').references('id').inTable('classes')
    table.integer('skill_id').references('id').inTable('skills')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('user_skills')
}
