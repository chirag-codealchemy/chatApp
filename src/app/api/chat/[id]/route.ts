import { NextRequest, NextResponse } from 'next/server'
import data from '../../../../../DATA.json'
import mongoose, { isValidObjectId } from 'mongoose'
// import conversationSchema from '@/server/schemas/conversationSchema'
import { ObjectId } from 'mongodb'
import { Errorlike } from 'bun'

export const GET = async (
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  try {
    console.log('🚀 ~ file: route.ts:9 ~ id:', id)

    await mongoose.connect(process.env.MONGODB_URI!)

    // conversations

    // const conversationSchema =
    //   require('../../../../server/schemas/conversationSchema').default
    // mongoose.models.conversation ??

    const conversation =
      mongoose.models.conversations ??
      require('../../../../server/schemas/conversationSchema').default
    const userSchema =
      mongoose.models.users ??
      require('../../../../server/schemas/userSchema').default

    console.log('🚀 ~ file: route.ts:16 ~ conversationSchema:', conversation)

    if (isValidObjectId(id)) {
      const data = await conversation
        .findById(id)
        .populate('users', ['name', 'image'])
        .lean()
      if (data && !data?.isGroup) {
        data.users?.forEach((e: any) => {
          if (String(e._id) !== id) {
            data.name = e.name
          }
        })
      }
      console.log('🚀 ~ file: route.ts:11 ~ data:', data)
      return NextResponse.json(data)
    } else {
      throw new Error('Invalid ID')
    }
  } catch (error: any) {
    console.log('🚀 ~ file: route.ts:12 ~ error:', error)
    return NextResponse.json({ error, message: error?.message })
  }
}

export const POST = () => {}
