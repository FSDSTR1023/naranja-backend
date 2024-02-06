import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
      maxlenght: 50,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    isDeleted: {
      type: Boolean,
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: null,
    },
    image: {
      type: String,
      trim: true,
    },
    video: {
      type: String,
      trim: true,
    },
    fileAtt: {
      type: String,
      trim: true,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Message', messageSchema)
