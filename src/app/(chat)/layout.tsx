import React from 'react'

import Left from '../components/Left'
import SocketProvider from './SocketProvider'
import UserListModal from '../components/UserListModal'

const RootLayout: RootLayoutType = async ({ children }) => {
  return (
    <div className="flex">
      <SocketProvider>
        <Left />
        {children}
        <UserListModal />
      </SocketProvider>
    </div>
  )
}

export default RootLayout
