export const getAdmin = async (req, res) => {
  // const { userId } = req.params;
  try {
    return res.status(200).send({ user: 'admin data' })
  } catch (err) {
    console.log(err)
    return res.status(400).send('Admin not found')
  }
}
