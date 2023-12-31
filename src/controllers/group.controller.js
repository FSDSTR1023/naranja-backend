import Group from '../models/group.model.js'

export const getAllGroups = async (req, res) => {
  // <-- sera POST
  const { userId } = req.body
  console.log(userId, '<--- userId')
  try {
    const groupsFound = await Group.find()

    console.log(groupsFound, '<--- groupsFound')
    if (!groupsFound) {
      return res.status(400).send('Groups not found')
    }
    const filteredGroupsByMember = groupsFound.filter((group) => {
      return group.members.includes(userId)
    })
    console.log(filteredGroupsByMember, '<--- filteredGroupsByMember')
    if (!filteredGroupsByMember) {
      return res.status(400).send('Groups not found')
    }

    res.status(200).json(filteredGroupsByMember)
  } catch (error) {
    console.error(error, '<--- ERROR')
    res.status(500).json({ msg: 'Internal server error' })
  }
}

export const createNewGroup = async (req, res) => {
  const { name, description, ownerUser, members } = req.body

  try {
    const newGroup = await new Group({
      name,
      description,
      ownerUser: ownerUser,
      members: members,
    })
    const groupSaved = await newGroup.save()
    if (!groupSaved) {
      return res.status(400).send('Group not saved')
    }
    res.status(200).json(groupSaved)
  } catch (error) {
    console.error(error, '<--- ERROR')
    return res.status(500).json({ msg: 'Something went wrong' })
  }
}

export const editGroup = async (req, res) => {
  const { name, description, members } = req.body
  try {
    const groupFound = await Group.findById(req.params.id)
    if (!groupFound) {
      return res.status(400).send('Group not found')
    }
    const newMembers = [...groupFound.members, ...members]

    const groupUpdated = await Group.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        members: newMembers,
      },
      { new: true }
    )
    if (!groupUpdated) {
      return res.status(400).send('Group not updated')
    }
    res.status(200).json(groupUpdated)
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong' })
  }
}

export const deleteGroup = async (req, res) => {
  try {
    const groupFound = await Group.findByIdAndDelete(req.params.id, {
      new: true,
    })
    if (!groupFound) {
      return res.status(400).send('Group not found')
    }
    res.status(200).json(groupFound)
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong' })
  }
}

export const deleteMember = async (req, res) => {
  const { members } = req.body
  try {
    const modifyGroup = await Group.findById(req.params.id)
    if (!modifyGroup) {
      return res.status(400).send('Group not found')
    }
    const newMembers = modifyGroup.members.filter(
      (member) => member !== members
    )
    const groupUpdated = await Group.findByIdAndUpdate(
      req.params.id,
      {
        members: newMembers,
      },
      { new: true }
    )
    if (!groupUpdated) {
      return res.status(400).send('Group not updated')
    }
    res.status(200).json(groupUpdated)
  } catch (error) {
    console.error(error, '<--- ERROR')
    return res.status(500).json({ msg: 'Something went wrong' })
  }
}
