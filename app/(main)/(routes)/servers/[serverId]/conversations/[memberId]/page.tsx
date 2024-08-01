import { auth } from '@/lib/auth'
import axiosInstance from '@/lib/axios-instance'
import { memberResponseSchema } from '@/schema/responseSchema/memberResponseSchema'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { MemberIdPageSkelton } from './components/memberIdPageSkelton'

interface MemberIdPageProps {
  params: {
    memberId: string
    serverId: string
  }
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const session = await auth()
  if (!session) redirect('/sign-in')
  try {
    const { data } = await axiosInstance(session.user.jwtToken).get(
      `/api/v1/members/${params.serverId}`
    )
    const parsedMemberData = await memberResponseSchema.safeParseAsync(data)
    if (!parsedMemberData.success) {
      return <div>Error: response validation error</div>
    }
    return <div>MemberIdPage</div>
    // return {
    //   type: 'success',
    //   message: parsedMemberData.data.message,
    //   data: parsedMemberData.data.data.member,
    // }
  } catch (error) {
    console.error('get member error', error)
    return (
      <div>Error: {error instanceof Error ? error.message : String(error)}</div>
    )
  }
}

const MemberIdPageWrapper = ({ params }: MemberIdPageProps) => {
  return (
    <Suspense fallback={<MemberIdPageSkelton />}>
      <MemberIdPage params={params} />
    </Suspense>
  )
}

export default MemberIdPageWrapper
