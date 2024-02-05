import { Router } from 'express'

import {
  getAllGroups,
  createNewGroup,
  editGroup,
  deleteMember,
  deleteGroup,
  getGroupByIdOrCreate,
  updateLastMessage,
  getCurrentGroup,
} from '../controllers/group.controller.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()
//router.use(authRequired)

router.get('/groups/:userId', getAllGroups)

router.post('/', createNewGroup)

router.put('/:id', editGroup)

router.delete('/:id', deleteGroup)

router.post('/group', getGroupByIdOrCreate)

router.patch('/group/lastMessage/:groupId', updateLastMessage)

router.patch('/member/:id', deleteMember)

router.get('/currentGroup/:groupId', getCurrentGroup)

export default router
