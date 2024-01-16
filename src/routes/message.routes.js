import { Router } from 'express'
import {
  createMessageRequest,
  getAllMessagesByGroupId,
} from '../controllers/message.controller.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()

router.use(authRequired)

router.post('/message', createMessageRequest)

router.get('/:id_group', getAllMessagesByGroupId)

export default router
