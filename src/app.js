import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connectDB } from './db.js'
import 'dotenv/config'
import userRoutes from './routes/user.routes.js'
import taskRoutes from './routes/task.routes.js'
import groupRoutes from './routes/group.routes.js'
import messageRoutes from './routes/message.routes.js'
import { Server } from 'socket.io'

import { videoRequest } from './controllers/video.controller.js'
import { changeStatusUser } from './services/user.service.js'

const port = process.env.PORT || 4000
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://naranja-team-tasktalk.netlify.app',
]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.use('/', userRoutes)
app.use('/task', taskRoutes)
app.use('/group', groupRoutes)
app.use('/messages', messageRoutes)
app.get('/video/:room&:username', videoRequest)

app.get('/helper', (req, res) => {
  res.status(200).send('helper')
})

connectDB()
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

const io = new Server(server, {
  cors: {
    origin: '*',
    withCredentials: true,
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log(`a user connected ${socket.id} `)

  socket.on('new-user', (user) => {
    socket.broadcast.emit('new-user-online', user)
  })

  socket.on('user-status', () => {
    socket.broadcast.emit('user-status-change')
  })

  socket.on('join-room', (room) => {
    socket.join(room)
    console.log(`user joined room: ${room} with id: ${socket.id}`)
  })

  socket.on('send-message', (data) => {
    console.log(data, 'data')

    socket.to(data.room).emit('receive-message', data.messageData)
  })

  socket.on('disconnect-user', async (user) => {
    socket.broadcast.emit('user-disconnected', user)
    const respUser = await changeStatusUser(user)
    console.log('ESTE USUARIO SE HA DESCONECTADO', respUser)
  })

  socket.on('disconnect', () => {
    console.log(`user disconnected ${socket.id}`)
  })
})
