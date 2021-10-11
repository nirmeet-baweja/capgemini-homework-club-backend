exports.seed = async function (knex) {
  // function to return a random number in a given range of numbers
  const getRandomIntInclusive = (min, max) => {
    const ceilMin = Math.ceil(min)
    const floorMax = Math.floor(max)
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (floorMax - ceilMin + 1) + ceilMin)
  }

  // get the list of classes
  const classesId = await knex('classes').select('id').orderBy('id')

  const maxNumSkills = 4

  // array to store the rows for class_skills table
  const classSkills = []

  // create the skills for each classId
  classesId.forEach((classId) => {
    const skills = []
    const numOfSkills = getRandomIntInclusive(1, maxNumSkills)
    let skillCount = 0

    // create an array for skills for the classId
    while (skillCount < numOfSkills) {
      const skill = getRandomIntInclusive(1, maxNumSkills)
      if (!skills.includes(skill)) {
        skills.push(skill)
        skillCount += 1
      }
    }

    // push the data to classSkills array
    for (let i = 0; i < numOfSkills; i += 1) {
      const classSkill = {
        class_id: classId.id,
        skill_id: skills[i],
      }
      classSkills.push(classSkill)
    }
  })

  // Deletes ALL existing entries
  return knex('class_skills')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('class_skills').insert(classSkills)
    )
}
