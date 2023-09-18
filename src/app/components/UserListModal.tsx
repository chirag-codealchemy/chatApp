'use client'

import React, { useContext } from 'react'
import { SocketContext } from '../(chat)/SocketProvider'
import Image from 'next/image'

const UserListModal = () => {
  const { users, socket } = useContext(SocketContext)
  console.log('🚀 ~ file: UserListModal.tsx:9 ~ UserListModal ~ users:', users)

  return users.length ? (
    <div className="fixed flex h-screen w-screen flex-col  items-center justify-center  bg-black/50">
      <div className="flex w-96 flex-col items-center rounded-lg bg-white py-2 ">
        <div className="text-xl">Select User</div>
        {users?.map((e, i) => (
          <div
            key={i}
            onClick={() =>
              socket?.send(JSON.stringify({ type: 'NEW_CHAT', data: e?._id }))
            }
            className="m-2 flex w-11/12 items-center"
          >
            <Image
              src={e?.image}
              alt="img"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="ml-4">{e?.name}</div>
          </div>
        ))}
      </div>
    </div>
  ) : null
}

export default UserListModal
