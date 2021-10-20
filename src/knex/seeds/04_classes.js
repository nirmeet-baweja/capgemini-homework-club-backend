exports.seed = function (knex) {
  // function to return a random number in a given range of numbers
  const getRandomIntInclusive = (min, max) => {
    const ceilMin = Math.ceil(min)
    const floorMax = Math.floor(max)
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (floorMax - ceilMin + 1) + ceilMin)
  }

  const defaultCallLink = 'https://us10jeb.zoom.us/j/724496xyz'

  const sampleComments = [
    'Sed ante. Vivamus tortor. Duis mattis egestas metus.',
    'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
    'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.',
    'Fusce consequat. Nulla nisl. Nunc nisl.',
    'Some dummy data to make the pages look good',
    'Talk a bit about the topics of the class',
    'Discuss the latest technologies',
    '',
    '',
    '',
    '',
    '',
  ]
  // Deletes ALL existing entries
  return knex('classes')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('classes').insert([
        {
          id: 1,
          date: '2021-02-17',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 2,
          date: '2021-03-03',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 3,
          date: '2021-03-17',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 4,
          date: '2021-03-31',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 5,
          date: '2021-04-28',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 6,
          date: '2021-05-12',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 7,
          date: '2021-05-26',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 8,
          date: '2021-06-09',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 9,
          date: '2021-06-23',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 10,
          date: '2021-07-07',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 11,
          date: '2021-07-21',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 12,
          date: '2021-08-04',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 13,
          date: '2021-08-18',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 14,
          date: '2021-09-01',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 15,
          date: '2021-09-15',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 16,
          date: '2021-09-29',
          is_submitted: true,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 17,
          date: '2021-10-13',
          is_submitted: false,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 18,
          date: '2021-10-27',
          is_submitted: false,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
        {
          id: 19,
          date: '2021-11-10',
          is_submitted: false,
          call_link: defaultCallLink,
          comments:
            sampleComments[getRandomIntInclusive(0, sampleComments.length)],
        },
      ])
    )
}
