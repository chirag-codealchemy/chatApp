import { Schema, model } from 'mongoose'

const conversationSchema = new Schema(
  {
    name: { type: Schema.Types.String },
    image: { type: Schema.Types.String },
    isGroup: { type: Schema.Types.Boolean, default: false },
    users: { ref: 'users', required: true, type: Schema.Types.Array },
  },
  { timestamps: true },
)

export default model('conversations', conversationSchema)
