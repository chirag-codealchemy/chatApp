'use client'

import { signIn } from 'next-auth/react'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const Page = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const login = () => {
    const email = document.getElementById('email')?.value
    const password = document.getElementById('password')?.value
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    signIn('credentials', { email, password, redirect: false })
      .then((res) => {
        console.log('🚀 ~ file: page.tsx:14 ~ signIn ~ res:', res)
        router.replace(callbackUrl)
      })
      .catch((e) => {
        console.log('🚀 ~ file: page.tsx:18 ~ signIn ~ e:', e)
      })
  }

  return (
    <div className="flex h-screen flex-1 items-center justify-center bg-gray-700">
      {/* <div className="flex max-h-96 w-11/12 max-w-md flex-1 flex-col rounded-lg bg-gray-400 p-4 ">
        <div className="my-4 text-center text-3xl">Login</div>
        <div className="flex flex-col">
          Email
          <input
            id="email"
            type="text"
            className="h-8 rounded-md border border-gray-400 "
          />
        </div>
        <div className="mt-2 flex flex-col">
          Password
          <input
            id="password"
            type="password"
            className="h-8 rounded-md border border-gray-400 "
          />
        </div>
        <div
          className="mb-8 mt-6 flex h-8 w-32 items-center justify-center self-center rounded-xl bg-gray-100"
          onClick={login}
        >
          Login
        </div>
      </div> */}
      <div
        onClick={() =>
          signIn('google', {
            callbackUrl: searchParams.get('callbackUrl') || '/',
            redirect: true,
          })
        }
        className="flex h-12 w-10/12 max-w-xs items-center justify-center rounded-lg bg-blue-700 text-white "
      >
        Google login
      </div>
    </div>
  )
}

export default Page
