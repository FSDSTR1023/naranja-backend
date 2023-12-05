import Task from '../models/task.model.js'

export const getAllTasks = async (req, res) => {
  try {
    const findTasks = await Task.find()
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
  const {
    title,
    description,
    status,
    dateStart,
    dateEnd,
    imageAt,
    fileAt,
    videoAt,
    group,
  } = req.body
  try {
    const newTask = await new Task({
      title,
      description,
      status,
      dateStart,
      dateEnd,
      imageAt,
      fileAt,
      videoAt,
      group,
    })
    console.log(newTask, '<--- newTask from createNewTask controller')
    const taskSaved = await newTask.save()
    if (!taskSaved) {
      // <--- una validacion
      return res.status(400).send('Task not saved')
    }
    res.status(200).json(taskSaved)
  } catch (error) {
    return res
      .status(500)
      .json({ msg: 'Internal server error, something went wrong' })
  }
}

export const editTask = async (req, res) => {
  const {
    title,
    description,
    status,
    dateStart,
    dateEnd,
    imageAt,
    fileAt,
    videoAt,
    group,
  } = req.body
  try {
    const taskFound = await Task.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title,
        description,
        status,
        dateStart,
        dateEnd,
        imageAt,
        fileAt,
        videoAt,
        group,
      },
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
