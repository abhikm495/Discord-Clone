import ChatHeader from '@/components/chat/chat-header'
import { auth } from '@/lib/auth'
import axiosInstance from '@/lib/axios-instance'
import {
  ChannelResponseSchema,
  channelResponseSchema,
} from '@/schema/responseSchema/channelResponseSchema'
import {
  MemberResponseSchema,
  memberResponseSchema,
} from '@/schema/responseSchema/memberResponseSchema'
import { redirect } from 'next/navigation'
import { ChannelSkelton } from './components/channelSkelton'
import { Suspense } from 'react'

interface ChannelData {
  type: 'error' | 'success'
  message: string
  data?: ChannelResponseSchema
}
interface MemberData {
  type: 'error' | 'success'
  message: string
  data?: MemberResponseSchema
}
interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const session = await auth()
  if (!session) redirect('/sign-in')

  const getChannelData = async (): Promise<ChannelData> => {
    try {
      const { data } = await axiosInstance(session.user.jwtToken).get(
        `/api/v1/channels/${params.channelId}`
      )
      const parsedChannelData = await channelResponseSchema.safeParseAsync(data)
      if (!parsedChannelData.success) {
        return {
          type: 'error',
          message: 'response validation error',
        }
      }
      return {
        type: 'success',
        message: parsedChannelData.data.message,
        data: parsedChannelData.data.data.channel,
      }
    } catch (error) {
      console.log('get channel error', error)
      return {
        type: 'error',
        message: JSON.stringify(error),
      }
    }
  }
  const getMemberData = async (): Promise<MemberData> => {
    try {
      const { data } = await axiosInstance(session.user.jwtToken).get(
        `/api/v1/members/${params.serverId}`
      )
      const parsedMemberData = await memberResponseSchema.safeParseAsync(data)
      if (!parsedMemberData.success) {
        return {
          type: 'error',
          message: 'response validation error',
        }
      }
      return {
        type: 'success',
        message: parsedMemberData.data.message,
        data: parsedMemberData.data.data.member,
      }
    } catch (error) {
      console.log('get member error', error)
      return {
        type: 'error',
        message: JSON.stringify(error),
      }
    }
  }

  const [channelData, memberData] = await Promise.all([
    getChannelData(),
    getMemberData(),
  ])

  if (channelData.type === 'error' || memberData.type === 'error') {
    return <div>Error loading data</div>
  }

  if (!channelData.data || !memberData.data) {
    return <div>Data undefined</div>
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channelData.data.name}
        serverId={channelData.data.serverId.toString()}
        type="channel"
      />
    </div>
  )
}

const ChannelIdPageWrapper = ({ params }: ChannelIdPageProps) => {
  return (
    <Suspense fallback={<ChannelSkelton />}>
      <ChannelIdPage params={params} />
    </Suspense>
  )
}

export default ChannelIdPageWrapper
