import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlenght: 3,
      maxlenght: 25,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlenght: 3,
      maxlenght: 250,
    },
    status: {
      type: String,
      default: 'pending',
    },
    dateStart: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    dateEnd: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    imageAt: {
      type: String,
      trim: true,
    },
    videoAt: {
      type: String,
      trim: true,
    },
    fileAt: {
      type: String,
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Task', taskSchema)
