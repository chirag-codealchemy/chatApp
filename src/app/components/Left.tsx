'use client'

import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useEffect } from 'react'
import { SocketContext } from '../(chat)/SocketProvider'
import moment from 'moment'

function Left() {
  const { chatList, socket } = useContext(SocketContext)

  const { data } = useSession()

  return (
    <div className="flex h-screen max-h-screen w-80 min-w-[320px] flex-col justify-between border-r">
      <div className="flex items-center border-b px-2 ">
        <Image
          src={data?.user?.image || ''}
          width={48}
          height={48}
          alt="DP"
          className="h-12 w-12 rounded-full "
        />
        <div className="m-2 grow">
          <div className="text-lg font-semibold">{data?.user?.name}</div>
          <div className="text-sm">{data?.user?.email}</div>
        </div>
        <div
          className="text-5xl font-thin "
          onClick={() => socket?.send(JSON.stringify({ type: 'GET_USERS' }))}
        >
          +
        </div>
      </div>
      <div className="flex grow flex-col ">
        {chatList.map((e, i) => {
          return (
            <Link
              href={`/${e?._id}`}
              key={`CHAT_LIST_${i}`}
              className="m-2 flex items-center "
            >
              <Image
                alt="pic"
                width={32}
                height={32}
                src={'https://picsum.photos/128'}
                className="h-12 w-12 rounded-full"
              />
              <div className="w-full">
                <div className="px-2 text-lg font-semibold ">{e?.name}</div>
                <div className="px-2 text-sm">{e?.lastMessage?.content}</div>
              </div>
              <div className="flex h-full flex-col items-end justify-between ">
                <div className="whitespace-nowrap px-2 text-sm ">
                  {moment(e?.lastMessage?.updatedAt).isBefore(
                    moment().add(-1, 'day'),
                  )
                    ? moment(e?.lastMessage?.updatedAt).format('hh:mm')
                    : moment(e?.lastMessage?.updatedAt).format('DD/MM/YY')}
                </div>
                <div className="mb-1 rounded-full bg-red-500 px-2 text-xs ">
                  {e?.unreadCount || null}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      <div
        onClick={() =>
          signOut({ callbackUrl: 'http://192.168.0.99:3000/', redirect: true })
        }
        className="flex h-12 w-full items-center justify-center bg-red-50"
      >
        LOGOUT
      </div>
    </div>
  )
}

export default Left
