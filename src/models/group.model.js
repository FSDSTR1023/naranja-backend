import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlenght: 1,
      maxlenght: 25,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlenght: 3,
      maxlenght: 250,
    },
    creatUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)
export default mongoose.model('Group', groupSchema)
