exports.seed = async function (knex) {
  // function to return a random number in a given range of numbers
  const getRandomIntInclusive = (min, max) => {
    const ceilMin = Math.ceil(min)
    const floorMax = Math.floor(max)
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (floorMax - ceilMin + 1) + ceilMin)
  }

  // get the list of volunteers
  const volunteersId = await knex('users')
    .select('id')
    .where('role_id', 2)
    .orderBy('id')

  // get total number of skills in the skills table
  const totalNumSkills = await knex('skills').count('id')

  // array to store the rows for user_skills table
  const userSkills = []

  // create the skills for each volunteer
  volunteersId.forEach((volunteer) => {
    const skills = []
    const numOfSkills = getRandomIntInclusive(1, totalNumSkills[0].count)
    let skillCount = 0

    // create an array for skills for the volunteer
    while (skillCount < numOfSkills) {
      const skill = getRandomIntInclusive(1, numOfSkills)
      if (!skills.includes(skill)) {
        skills.push(skill)
        skillCount += 1
      }
    }

    // push the data to userSkills array
    for (let i = 0; i < numOfSkills; i += 1) {
      const userSkill = {
        user_id: volunteer.id,
        skill_id: skills[i],
      }
      userSkills.push(userSkill)
    }
  })

  // Deletes ALL existing entries
  return knex('user_skills')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('user_skills').insert(userSkills)
    )
}
