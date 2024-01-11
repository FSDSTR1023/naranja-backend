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

const port = process.env.PORT || 4000
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']
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

  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    console.log(`user joined room: ${roomId} with id: ${socket.id}`)
  })

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data)
  })

  socket.on('disconnect', () => {
    console.log(`user disconnected ${socket.id}`)
  })
})
