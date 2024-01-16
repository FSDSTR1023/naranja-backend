import { Router } from 'express'
import {
  registerUser,
  logInUser,
  verifyUser,
  logOutUser,
  editProfileUser,
  editUserPassword,
  getAllUsers,
} from '../controllers/user.controller.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()

router.post('/register', registerUser)

router.post('/user/verify/:token', verifyUser)

router.post('/login', logInUser)

router.use(authRequired)

router.patch('/logout', logOutUser)

router.put('/user/update', editProfileUser)

router.get('/', getAllUsers)

router.put('/user/password', editUserPassword)

export default router
