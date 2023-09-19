'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { createContext, useEffect, useRef, useState } from 'react'

type SocketContextType = {
  socket: WebSocket | null
  chatList: []
  users: []
  chat: {}
  messages: []
  chatRef: any
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  chatList: [],
  users: [],
  chat: {},
  messages: [],
  chatRef: null,
})

const SocketProvider: RootLayoutType = ({ children }) => {
  const [chat, setChat] = useState([])
  const [users, setUsers] = useState([])
  const [chatList, setChatList] = useState([])
  const [messages, setMessages] = useState([])
  const [url, setUrl] = useState('ws://192.168.0.99:3210')
  const [socket, setSocket] = useState<WebSocket | null>(null)

  const chatRef = useRef(null)
  const router = useRouter()

  const { id } = useParams()
  console.log('🚀 ~ file: SocketProvider.tsx:33 ~ params:', id)

  useEffect(() => {
    setChatList(
      chatList.map((e) => {
        // @ts-ignore
        if (e._id === id) {
          // @ts-ignore
          e.unreadCount = 0
        }
        return e
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    try {
      const socket = new WebSocket(url)
      socket.addEventListener('error', (error) => setUrl('ws://localhost:3210'))
      socket.addEventListener('open', () => setSocket(socket))
      socket.addEventListener('message', (event) => {
        const { data, type } = JSON.parse(event.data)
        console.log('BROWSER ----->', type, data)

        switch (type) {
          case 'GET_CHAT_LIST':
            setChatList(data)
            break

          case 'GET_USERS':
            setUsers(data)
            break

          case 'NEW_CHAT':
            router.replace(`/${data}`)
            setUsers([])
            break

          case 'GET_CHAT':
            setChat(data.chat)
            setMessages(data.messages)
            break

          case 'NEW_MESSAGE':
            setChatList(
              chatList.map((e) => {
                // @ts-ignore
                if (e._id === data.conversation) {
                  // @ts-ignore
                  e.lastMessage = data
                  // @ts-ignore
                  if (e._id !== id) {
                    // @ts-ignore
                    e.unreadCount = (e.unreadCount || 0) + 1
                  }
                }
                return e
              }),
            )

            if (id === data.conversation) {
              // @ts-ignore
              setMessages((e) => [...e, data])
              // @ts-ignore
              chatRef.current.scrollIntoView({ behavior: 'smooth' })
            }

            break

          default:
            break
        }
      })
      socket.addEventListener('close', ({ reason }) => {
        setSocket(null)
      })
      return () => socket.close()
    } catch (error) {
      console.log('🚀 ~ file: SocketProvider.tsx:18 ~ error:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return (
    <SocketContext.Provider
      value={{
        socket,
        chatList: chatList as [],
        users: users as [],
        chat: chat as {},
        messages: messages as [],
        chatRef,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
