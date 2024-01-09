import Message from '../models/messege.model.js'

export const createMessageRequest = async (req, res) => {
  const { body, author, group, image, video, fileAtt, time } = req.body
  console.log(req.body, '[<---- req.body- CREATE MESSAGE REQUEST]')
  try {
    const newMessage = await new Message({
      body,
      author,
      group,
      image,
      video,
      fileAtt,
      time: new Date(),
    })
    const messageSaved = await newMessage.save()
    if (!messageSaved) {
      return res.status(400).json({ msg: 'Message not saved' })
    }
    res.status(200).json(messageSaved)
  } catch (error) {
    console.error(error, '<--- ERROR')
    return res.status(500).json({ msg: 'Something went wrong' })
  }
}

export const getAllMessagesByGroupId = async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.id_group })
      .populate('author')
      .sort({ time: 1 })
    if (!messages) {
      return res.status(400).json({ msg: 'Messages not found' })
    }
    res.status(200).json(messages)
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong' })
  }
}
