import { Schema, model } from 'mongoose'

const messageSchema = new Schema(
  {
    content: { required: true, type: Schema.Types.String },
    user: {
      ref: 'users',
      required: true,
      type: Schema.Types.ObjectId,
    },
    conversation: {
      ref: 'conversations',
      required: true,
      type: Schema.Types.ObjectId,
    },
    type: {
      required: true,
      type: Schema.Types.String,
      enum: ['TEXT', 'IMAGE', 'LINK'],
    },
  },
  { timestamps: true },
)

export default model('messages', messageSchema)
