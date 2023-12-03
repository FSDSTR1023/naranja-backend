import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlenght: 1,
      maxlenght: 25,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
      minlenght: 1,
      maxlenght: 25,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlenght: 3,
      maxlenght: 25,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlenght: 3,
      maxlenght: 25,
    },
    role: {
      type: String,
      default: 'user',
    },
    status: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    isOnline: {
      type: String,
      default: 'offline',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', userSchema)
