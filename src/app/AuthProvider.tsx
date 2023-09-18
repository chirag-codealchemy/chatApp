'use client'
import { SessionProvider } from 'next-auth/react'

const AuthProvider: RootLayoutType = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider
