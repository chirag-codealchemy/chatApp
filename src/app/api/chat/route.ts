import { NextRequest, NextResponse } from 'next/server'
import data from '../../../../DATA.json'

export const GET = async (_req: NextRequest) => {
  return NextResponse.json(
    data?.map((e) => {
      const data = { ...e, name: e.users[0], lastUpdate: e.messages[0] }
      // @ts-ignore
      delete data.messages
      return data
    }),
  )
}
