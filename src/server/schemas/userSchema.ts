import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: Schema.Types.String },
    image: { type: Schema.Types.String },
    email: { type: Schema.Types.String },
    password: { type: Schema.Types.String },
    emailVerified: { type: Schema.Types.Date },
  },
  { timestamps: true },
)

export default model('users', userSchema)
