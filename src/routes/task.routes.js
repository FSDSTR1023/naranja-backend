import { Router } from 'express'
import {
  getAllTasks,
  createNewTask,
  editTask,
  deleteTask,
  markAsDeletedTask,
  cleanAllDeletedTasks,
  updateManyTasks,
  updateTitleTask,
  updateTaskInfo,
} from '../controllers/task.controller.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()

router.use(authRequired)

router.get('/:groupId', getAllTasks)

router.delete('/deleted/:id', deleteTask)

router.put('/:groupId', editTask)

router.post('/newTask', createNewTask)

router.delete('/deleted-all', cleanAllDeletedTasks)

router.patch('/:id', markAsDeletedTask)

router.post('/updateMany/:groupId', updateManyTasks)

router.put('/updateTitle/:containerId', updateTitleTask)

router.put('/updateTaskInfo/:containerId', updateTaskInfo)

export default router
