import { Router } from 'express'
import {
  getAllTasks,
  createNewTask,
  editTask,
  recoverDeletedTask,
  markAsDeletedTask,
  cleanAllDeletedTasks,
} from '../controllers/task.controller.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()

router.use(authRequired)

router.get('/', getAllTasks)

router.put('/deleted/:id', recoverDeletedTask)

router.put('/:id', editTask)

router.post('/', createNewTask)

router.delete('/deleted-all', cleanAllDeletedTasks)

router.patch('/:id', markAsDeletedTask)

export default router
