import { Router } from 'express'
import {
  registerUser,
  logInUser,
  verifyUser,
  logOutUser,
  editProfileUser,
  getAllUsers,
} from '../controllers/user.controller.js'

const router = Router()

router.post('/register', registerUser)

router.post('/login', logInUser)

router.post('/user/verify/:token', verifyUser)

router.patch('/logout', logOutUser)

router.put('/user/update', editProfileUser)

router.get('/', getAllUsers) // <--- En el front hay que filtrar el log user

export default router
