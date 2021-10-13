exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('classes')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('classes').insert([
        { id: 1, date: '2021-02-17', is_submitted: true },
        { id: 2, date: '2021-03-03', is_submitted: true },
        { id: 3, date: '2021-03-17', is_submitted: true },
        { id: 4, date: '2021-03-31', is_submitted: true },
        { id: 5, date: '2021-04-28', is_submitted: true },
        { id: 6, date: '2021-05-12', is_submitted: true },
        { id: 7, date: '2021-05-26', is_submitted: true },
        { id: 8, date: '2021-06-09', is_submitted: true },
        { id: 9, date: '2021-06-23', is_submitted: true },
        { id: 10, date: '2021-07-07', is_submitted: true },
        { id: 11, date: '2021-07-21', is_submitted: true },
        { id: 12, date: '2021-08-04', is_submitted: true },
        { id: 13, date: '2021-08-18', is_submitted: true },
        { id: 14, date: '2021-09-01', is_submitted: true },
        { id: 15, date: '2021-09-15', is_submitted: true },
        { id: 16, date: '2021-09-29', is_submitted: true },
        { id: 17, date: '2021-10-13', is_submitted: false },
        { id: 18, date: '2021-10-27', is_submitted: false },
        { id: 19, date: '2021-11-10', is_submitted: false },
      ])
    )
}
