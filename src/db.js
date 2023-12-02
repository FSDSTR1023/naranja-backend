import mongoose from 'mongoose'
import 'dotenv/config'

const mongoDB =
  'mongodb+srv://' +
  process.env.DB_USER +
  ':' +
  process.env.DB_PASSWORD +
  '@' +
  process.env.DB_SERVER +
  '/' +
  process.env.DB_NAME +
  '?retryWrites=true&w=majority'
console.log(mongoDB, 'mongoDB')

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
    })
  } catch (error) {
    console.error(error, '<--- ERROR')
  }
}
