exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('roles')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('roles').insert([
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Volunteer' },
        { id: 3, name: 'Student' },
      ])
    )
}
