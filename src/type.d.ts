type user = {
  id: string
  name: string
  image: string
}

type group = {
  id: string
  name: string
  image: string
}

type chat = {
  id: string
  users: user[]
  isGroup: boolean
  groups: group[]
  unreadCount?: number
  lastUpdate: string
  name: string
}

type RootLayoutType = ({
  children,
}: {
  children: React.ReactNode
}) => React.ReactNode
