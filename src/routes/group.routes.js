import { Router } from 'express'

import {
  getAllGroups,
  createNewGroup,
  editGroup,
  deleteMember,
  deleteGroup,
  getGroupByIdOrCreate,
} from '../controllers/group.controller.js'

const router = Router()

router.post('/groups', getAllGroups)

router.post('/', createNewGroup)

router.put('/:id', editGroup)

router.patch('/:id', deleteMember)

router.delete('/:id', deleteGroup)

router.post('/group', getGroupByIdOrCreate)

export default router
