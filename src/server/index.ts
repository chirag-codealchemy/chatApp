import { decode } from 'next-auth/jwt'
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import conversationSchema from './schemas/conversationSchema'
import { ObjectId, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'
import { Server } from 'bun'
import userSchema from './schemas/userSchema'
import messageSchema from './schemas/messageSchema'

const fetch = async (req: Request, server: Server) => {
  try {
    const token = await decode({
      token: parseCookie(req.headers.get('cookie')!).get(
        'next-auth.session-token',
      ),
      secret: process.env.NEXTAUTH_SECRET!,
    })
    console.log('🚀 ~ file: index.ts:18 ~ fetch ~ token:', token)

    const success = server.upgrade(req, { data: token })
    if (!success) throw success

    return undefined
  } catch (error) {
    console.log('🚀 ~ file: index.ts:15 ~ fetch ~ error:', error)
    return new Response('Error world!')
  }
}

const runServer = async (firstRun = false) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverApi: ServerApiVersion.v1,
    })

    const server = Bun.serve<{ id: string }>({
      fetch,
      websocket: {
        async open(ws) {
          ws.subscribe(ws.data.id)
          console.log(
            '🚀 ~ file: server.ts:28 ~ open ~ ws.data?.id:',
            ws.data?.id,
          )
          let data = await conversationSchema
            .find({ users: ws.data?.id })
            .populate('users', ['email', 'name', 'image'])
            .lean()

          data = await Promise.all(
            data.map(async (_e) => {
              const d = { ..._e }
              if (!d.isGroup) {
                // @ts-ignore
                d.users.forEach((e: any) => {
                  if (e._id !== ws.data?.id) {
                    d.name = e.name
                    d.image = e.image
                  }
                })
              }

              d.lastMessage = (
                await messageSchema
                  .find({ conversation: d._id })
                  .sort({ createdAt: 1 })
                  .limit(1)
                  .lean()
              )[0]

              return d
            }),
          )
          ws.send(JSON.stringify({ type: 'GET_CHAT_LIST', data }))
        },
        async message(ws, message) {
          try {
            const { data, type } = JSON.parse(message as string)
            console.log(`[SERVER] ---->`, type, data)

            const sendData = (data: any) =>
              ws.send(JSON.stringify({ type, data }))

            if (type === 'GET_USERS') {
              const data = await userSchema.find(
                { _id: { $ne: ws.data.id } },
                { email: true, image: true, name: true },
              )
              sendData(data)
            }
            if (type === 'NEW_CHAT') {
              let conversation
              conversation = await conversationSchema
                .find({
                  $and: [{ users: ws.data.id }, { users: data }],
                })
                .lean()
              if (conversation.length === 0) {
                conversation = [
                  await conversationSchema.create({
                    users: [ws.data.id, data],
                  }),
                ]
              }
              sendData(conversation[0]._id)
            }

            if (type === 'GET_CHAT') {
              const chat = await conversationSchema
                .findById(data)
                .populate('users', ['name', 'image'])
                .lean()
              if (chat && !chat?.isGroup) {
                // @ts-ignore
                chat.users?.forEach((e: any) => {
                  if (String(e._id) !== data) {
                    chat.name = e.name
                    chat.image = e.image
                  }
                })
              }

              const messages = await messageSchema
                .find({ conversation: chat?._id })
                .sort({ createdAt: 1 })

              sendData({ chat, messages })
            }

            if (type === 'NEW_MESSAGE') {
              const msg = await messageSchema.create({
                type: 'TEXT',
                user: ws.data.id,
                content: data.message,
                conversation: data.id,
              })

              const chat = await conversationSchema
                .findById(msg.conversation)
                .lean()

              // @ts-ignore
              chat?.users.forEach((e) => {
                ws.publish(
                  String(e),
                  JSON.stringify({ type: 'NEW_MESSAGE', data: msg }),
                )
              })
              sendData(msg)
            }

            // if (type === 'MESSAGE') {
            //   sendData(data)
            // }

            if (type === 'KILL') {
              server.stop()
              mongoose.connection.close()
            }
            // ws.send(JSON.stringify({ message: data.message }))
          } catch (error) {
            console.log('🚀 ~ file: index.ts:55 ~ message ~ error:', error)
          }
        },
        close(ws, code, reason) {},
      },
      port: 3210,
    })
  } catch (error) {
    console.log('🚀 ~ file: index.ts:4 ~ error:', error)
    const { execSync } = require('node:child_process')
    execSync('bun kill')
    firstRun && runServer()
  }
}

// setInterval(() => {
//   console.log('🚀 ~ file: index.ts:2 ~ activeUser:', activeUser)
// }, 1000)

runServer(true)

// console.log(`Listening on localhost:\${server.port}`)

// setTimeout(() => {
//   server.stop()
// }, 1000)
