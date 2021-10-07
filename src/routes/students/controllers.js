export const getStudent = async (req, res) => {
  // const { userId } = req.params
  try {
    return res.status(200).send({ students: 'student data' })
  } catch (err) {
    console.log(err)
    return res.status(400).send('Student not found')
  }
}
