export const getVolunteer = async (req, res) => {
  // const { userId } = req.params;
  try {
    return res.status(200).send({ user: 'volunteer data' })
  } catch (err) {
    console.log(err)
    return res.status(400).send('User not found')
  }
}
