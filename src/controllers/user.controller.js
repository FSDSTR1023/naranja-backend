import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateTokenAccess } from '../libs/jsonwebtoken.js'
import jwt from 'jsonwebtoken'
import { sendEmailVerification } from '../services/mailing.js'

export const registerUser = async (req, res) => {
  const { name, surname, email, password } = req.body

  try {
    const userFound = await User.findOne({ email: email })
    if (userFound) {
      return res.status(400).send('User already exists')
    }
    const salt = await bcrypt.hash(password, 10)
    const user = new User({ name, surname, email, password: salt })
    const newUser = await user.save()
    console.log(newUser, '<--- newUser backend controller registration')
    const tokenAccess = await generateTokenAccess({ _id: newUser._id })

    // Enviar correo de verificacion de email --> api gmail
    sendEmailVerification(email, tokenAccess)
    res.status(200).json(newUser)
  } catch (error) {
    console.error(error, '<--- ERROR')
  }
}

export const verifyUser = async (req, res) => {
  console.log(req.params.token, '<--- req.params.token')
  try {
    const decodToken = await jwt.verify(
      req.params.token,
      process.env.TOKEN_SECRET
    )
    console.log(decodToken, '<--- decodToken')
    if (!decodToken || !decodToken._id) {
      return res.status(400).send('Token is invalid')
    }
    const userFound = await User.findByIdAndUpdate(
      decodToken._id,
      {
        status: true,
      },
      { new: true }
    )
    res.status(200).json(userFound)
    if (!userFound) {
      return res.status(400).json({ msg: 'User not found' })
    }
  } catch (error) {
    console.error(error, '<--- ERROR')
  }
}

export const logInUser = async (req, res) => {
  const { email, password, isOnline } = req.body
  try {
    const userFound = await User.findOneAndUpdate(
      { email },
      { isOnline },
      { new: true }
    )
    console.log(userFound, '<--- userFound')
    if (!userFound) {
      return res.status(400).send('User not found')
    }
    const isMatch = await bcrypt.compare(password, userFound.password)
    if (!isMatch) {
      return res.status(400).send('Invalid credentials')
    }
    if (!userFound.status) {
      return res.status(400).send('User not verified')
    }
    const tokenAccess = await generateTokenAccess({
      _id: userFound._id,
      name: userFound.name,
      surname: userFound.surname,
      email: userFound.email,
      avatar: userFound.avatar,
      isOnline: userFound.isOnline,
    })
    res.cookie('token', tokenAccess, {
      httpOnly: true,
    })
    res.status(200).json(userFound)
  } catch (error) {
    console.error(error, '<--- ERROR')
  }
}

export const logOutUser = async (req, res) => {
  const { _id } = req.user

  try {
    const userFound = await User.findByIdAndUpdate(
      { _id },
      { isOnline: 'offline' }
    )

    res.clearCookie('token')
    res.status(200).json({ msg: 'User logout' })
  } catch (error) {
    console.error(error, '<--- ERROR')
  }
}

export const editProfileUser = async (req, res) => {
  const { _id, role, avatar, isOnline } = req.body
  console.log(req.body, '<--- req.body')

  try {
    const userUpdate = await User.findByIdAndUpdate(
      _id,
      { role, avatar, isOnline },
      { new: true }
    )
    if (!userUpdate) {
      console.log(userUpdate, '<--- userUpdate from editProfileUser controller')
      return res.status(400).send('User not found')
    }
    console.log(userUpdate, '<--- userUpdate from editProfileUser controller')
    res.status(200).json(userUpdate)
  } catch (error) {
    console.error(error, '<--- ERROR')
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.error(error, '<--- ERROR')
  }
}

export const editUserPassword = async (req, res) => {
  const { _id, password } = req.body
  console.log(req.body, '<--- req.body')
  try {
    const newPassword = await bcrypt.hash(password, 10)
    const userFound = await User.findByIdAndUpdate(
      _id,
      { password: newPassword },
      { new: true }
    )
    if (!userFound) {
      return res.status(400).send('User not found')
    }
    res.status(200).json(userFound)
  } catch (error) {
    console.error(error, '<--- ERROR')
    res.status(400).send('User not found')
  }
}

export const logInWithToken = async (req, res) => {
  const { _id } = req.user
  console.log(req.user, '<--- req.user')
  try {
    const userFound = await User.findById(_id)
    if (!userFound) {
      return res.status(400).send('User not found')
    }
    res.status(200).json(userFound)
  } catch (error) {
    console.error(error, '[LOG IN WITH TOKEN ERROR]')
    res.status(400).send('token invalido')
  }
}
