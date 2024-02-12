import Task from '../models/task.model.js'

export const getAllTasks = async (req, res) => {
  const { groupId } = req.params

  try {
    const findTasks = await Task.find({ group: groupId })
      .populate('user')
      .populate('group')
      .populate('items.assignedTo')
      .populate('items.followers')
    console.log(findTasks, '<--- findTasks from getAllTasks controller')
    if (!findTasks) {
      return res.status(400).send('Tasks not found')
    }
    res.status(200).json(findTasks)
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

export const createNewTask = async (req, res) => {
  const { id, title, groupId, userId, items } = req.body
  try {
    const newTask = await new Task({
      id: id,
      title: title,
      group: groupId,
      user: userId,
      items: items,
    })

    const taskSaved = await newTask.save()
    if (!taskSaved) {
      // <--- una validacion
      return res.status(400).send('Task not saved')
    }
    res.status(200).json({ msg: 'Task saved' })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: 'Internal server error, something went wrong' })
  }
}

export const editTask = async (req, res) => {
  const { groupId } = req.params

  try {
    const taskFound = await Task.findOneAndUpdate(
      { id: groupId },
      { items: req.body },
      { new: true }
    )
    if (!taskFound) {
      return res.status(400).send('Task not found')
    }
    res.status(200).json(taskFound)
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

// no la borramos, solo la marcamos como borrada.
export const markAsDeletedTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndUpdate({ _id: req.params.id })
    if (!deletedTask) {
      return res.status(400).send('Task not found')
    }
    deletedTask.deletedAt = Date.now()

    const deletedTaskMod = await deletedTask.save()

    res.status(200).json(deletedTaskMod)
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

export const cleanAllDeletedTasks = async (req, res) => {
  try {
    const deletedTasks = await Task.find({ deletedAt: { $ne: null } })
    if (!deletedTasks) {
      return res.status(400).send('Tasks not found')
    }
    const deletedTasksCleaned = await Task.deleteMany({
      deletedAt: { $ne: null },
    })
    res.status(200).json(deletedTasksCleaned)
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

export const recoverDeletedTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndUpdate({ _id: req.params.id })
    if (!deletedTask) {
      return res.status(400).send('Task not found')
    }
    deletedTask.deletedAt = null

    const deletedTaskMod = await deletedTask.save()

    res.status(200).json(deletedTaskMod)
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

/// DELETE TASK VIENE POR EL ID Y NO POR _ID COMO EL RESTO DE LOS METODOS
export const deleteTask = async (req, res) => {
  const { id } = req.params
  try {
    const taskFound = await Task.findOneAndDelete({ id: id })
    if (!taskFound) {
      return res.status(400).send('Task not found')
    }
    res.status(200).json({ msg: 'Task deleted' })
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

export const updateManyTasks = async (req, res) => {
  const { groupId } = req.params

  const taskArray = req.body
  console.log(taskArray, '<--- Task Array from updateManyTasks controller')

  try {
    for (let i = 0; i < taskArray.length; i++) {
      const taskFound = await Task.findOneAndUpdate(
        { id: taskArray[i].id },
        { items: taskArray[i].items, title: taskArray[i].title, index: i },
        { new: true }
      )
      if (!taskFound) {
        return res.status(400).send('Task not found')
      }
    }
    res.status(200).json({ msg: 'Tasks updated' })
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' })
  }
}
export const updateTitleTask = async (req, res) => {
  const { containerId } = req.params
  const { title } = req.body

  try {
    const taskFound = await Task.findOneAndUpdate(
      { id: containerId },
      { title: title },
      { new: true }
    )
    if (!taskFound) {
      return res.status(400).send('Task not found')
    }
    res.status(200).json({ msg: 'Task updated' })
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

export const updateTaskInfo = async (req, res) => {
  const { containerId } = req.params

  console.log(req.body)
  const { _id } = req.body
  console.log(req.body, '<--- req.Body from updateTaskInfo controller')

  try {
    const taskFound = await Task.findOne({ id: containerId })

    if (!taskFound) {
      return res.status(400).send('Task not found')
    }
    const taskToEdit = taskFound.items.filter(
      (item) => item._id.toString() === _id
    )
    const index = taskFound.items.indexOf(taskToEdit[0])
    console.log(taskToEdit, '<--- taskToEdit from updateTaskInfo controller')
    console.log(index, '<--- index from updateTaskInfo controller')

    taskToEdit[0] = req.body
    taskFound.items[index] = taskToEdit[0]
    console.log(
      taskFound.items,
      '<--- taskFound.items from updateTaskInfo controller'
    )
    const containerUpdated = await Task.findOneAndUpdate(
      { id: containerId },
      { items: taskFound.items },
      {
        new: true,
      }
    )
    console.log(
      containerUpdated,
      '<--- containerUpdated from updateTaskInfo controller'
    )
    if (!containerUpdated) {
      return res.status(400).send('Task not found')
    }

    res.status(200).json({ msg: 'Task updated' })
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' })
  }
}
