'use client'

const Error = ({ error }: { error: Error }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div>Error: Something want wrong!</div>
      <div>{JSON.stringify(error)}</div>
    </div>
  )
}

export default Error
