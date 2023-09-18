'use client'

import React, { useContext, useEffect, useRef } from 'react'
import { SocketContext } from '../SocketProvider'
import Image from 'next/image'
import InputBox from './InputBox'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

const Page = () => {
  const { socket, chat, messages, chatRef } = useContext(SocketContext)

  const { id } = useParams()

  useEffect(() => {
    socket?.send(JSON.stringify({ type: 'GET_CHAT', data: id }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  const { data: session } = useSession()

  return (
    <div className="flex h-screen max-h-screen w-full flex-col bg-slate-50">
      <div className="flex w-full items-center bg-slate-100 text-2xl">
        {chat?.image && (
          <Image
            src={chat?.image}
            width={32}
            height={32}
            className="m-2 mr-4 h-12 w-12 rounded-full"
            alt="img"
          />
        )}
        {chat?.name}
      </div>
      <div className="flex h-screen flex-col overflow-x-scroll [&::-webkit-scrollbar]:hidden ">
        {messages?.map((e: any, i: number) => (
          <div
            ref={chatRef}
            key={e?.content + i}
            className={`float-right m-1 w-fit max-w-xs rounded-full bg-red-200 px-3 py-1 text-sm 
            ${e.user === session?.user?.id ? 'self-end' : 'self-start'}
            `}
          >
            {e?.content}
          </div>
        ))}
      </div>
      <InputBox chatId={chat?.id} />
    </div>
  )
}

export default Page
