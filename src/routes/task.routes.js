import { Router } from 'express'
import {
  getAllTasks,
  createNewTask,
  editTask,
  recoverDeletedTask,
  markAsDeletedTask,
  cleanAllDeletedTasks,
} from '../controllers/task.controller.js'

const router = Router()

router.get('/', getAllTasks)

router.put('/:id', editTask)

router.post('/', createNewTask)

router.delete('/deleted-all', cleanAllDeletedTasks)

router.patch('/:id', markAsDeletedTask)

router.put('/deleted/:id', recoverDeletedTask)

export default router
