import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    index: {
      type: Number,
      required: true,
      default: 0,
    },
    items: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,

          trim: true,
        },
        imageAt: {
          type: String,
          trim: true,
        },

        fileAt: {
          type: String,
          trim: true,
        },
        dateStart: {
          type: Date,
        },
        dateEnd: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Task', taskSchema)
