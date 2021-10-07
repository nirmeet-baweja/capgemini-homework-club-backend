export const getListOfStudyGroups = async (req, res) => {
  try {
    return res.status(200).send([{ id: 'return list of HWC study group' }])
  } catch (err) {
    console.log(err)
    return res.status(400).send('Error')
  }
}
