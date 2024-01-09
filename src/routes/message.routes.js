import { Router } from 'express'
import {
  createMessageRequest,
  getAllMessagesByGroupId,
} from '../controllers/message.controller.js'

const router = Router()

router.post('/message', createMessageRequest)

router.get('/:id_group', getAllMessagesByGroupId)

export default router
