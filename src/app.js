import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connectDB } from './db.js'
import 'dotenv/config'

const port = process.env.PORT || 4000
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

app.get('/helper', (req, res) => {
  res.status(200).send('helper')
})

connectDB()
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
