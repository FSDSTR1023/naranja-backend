import { Router } from 'express'
import {
  createMessageRequest,
  getAllMessagesByGroupId,
  editMessageById,
  deleteMessageById,
} from '../controllers/message.controller.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()

router.use(authRequired)

router.post('/message', createMessageRequest)

router.get('/:id_group', getAllMessagesByGroupId)

router.put('/edit-message/:id', editMessageById)

router.put('/delete-message/:id', deleteMessageById)

export default router
