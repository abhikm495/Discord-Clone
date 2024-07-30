import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const session = await auth()
  if (!session) redirect('/sign-in')
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {/* <ChatHeader/> */}
    </div>
  )
}

export default ChannelIdPage
