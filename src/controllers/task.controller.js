import Task from '../models/task.model.js'

export const getAllTasks = async (req, res) => {
  const { groupId } = req.params
  console.log(groupId, '<--- groupId from getAllTasks controller')

  try {
    const findTasks = await Task.find({ group: groupId })
    if (!findTasks) {
      return res.status(400).send('Tasks not found')
    }
    res.status(200).json(findTasks)
  } catch (error) {
    console.error(error, '<--- ERROR')
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

export const createNewTask = async (req, res) => {
  const { id, title, groupId, userId, items } = req.body
  try {
    console.log('[CREANDO TAREA]')
    const newTask = await new Task({
      id: id,
      title: title,
      group: groupId,
      user: userId,
      items: items,
    })
    console.log(newTask, '<--- newTask from createNewTask controller')
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
  console.log(req.body, '<--- req.body from editTask controller')

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
    console.error(error, '<--- ERROR')
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
    console.log(deletedTask, '<--- deletedTask from deleteTask controller')

    const deletedTaskMod = await deletedTask.save()

    res.status(200).json(deletedTaskMod)
  } catch (error) {
    console.error(error, '<--- ERROR')
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
    console.error(error, '<--- ERROR')
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
    console.log(deletedTask, '<--- deletedTask from deleteTask controller')

    const deletedTaskMod = await deletedTask.save()

    res.status(200).json(deletedTaskMod)
  } catch (error) {
    console.error(error, '<--- ERROR')
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
    console.error(error, '<--- ERROR')
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
    console.error(error, '<--- ERROR')
    return res.status(500).json({ msg: 'Internal server error' })
  }
}
export const updateTitleTask = async (req, res) => {
  const { containerId } = req.params
  const { title } = req.body
  console.log(title, '<--- title from updateTitleTask controller')
  console.log(containerId, '<--- containerId from updateTitleTask controller')

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
    console.error(error, '<--- ERROR')
    return res.status(500).json({ msg: 'Internal server error' })
  }
}
