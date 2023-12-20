import { Router } from 'express'

import {
  getAllGroups,
  createNewGroup,
  editGroup,
  deleteMember,
  deleteGroup,
} from '../controllers/group.controller.js'

const router = Router()

// Use GET for retrieving all groups??
router.get('/groups', getAllGroups)

router.post('/', createNewGroup)

router.put('/:id', editGroup)

router.patch('/:id', deleteMember)

router.delete('/:id', deleteGroup)

export default router
