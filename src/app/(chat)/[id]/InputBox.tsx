'use client'

import Image from 'next/image'
import React, { useContext, useRef } from 'react'
import { SocketContext } from '../SocketProvider'
import { useParams } from 'next/navigation'

function InputBox() {
  const input = useRef(null)
  const { id } = useParams()
  const { socket } = useContext(SocketContext)

  const sendMessage = () => {
    // @ts-ignore
    if (input?.current?.value) {
      socket?.send(
        JSON.stringify({
          type: 'NEW_MESSAGE',
          // @ts-ignore
          data: { message: input?.current?.value, id },
        }),
      )
      // @ts-ignore
      input.current.value = ''
    }
  }

  return (
    <div className="m-1 flex h-8 ">
      <input ref={input} type="text" className="grow p-1" />
      <Image
        alt=""
        width={32}
        height={32}
        src="/send.png"
        className="h-8 w-8 p-1"
        // @ts-ignore
        onClick={() => sendMessage()}
      />
    </div>
  )
}

export default InputBox
