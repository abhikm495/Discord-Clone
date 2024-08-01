import { redirect } from 'next/navigation'
import { InitialModal } from '@/components/modals/initial-modal'
import { auth } from '@/lib/auth'
import axiosInstance from '@/lib/axios-instance'
import { userFirstServerResponseSchema } from '@/schema/responseSchema/usersFirstServerResponseSchema'
import { AxiosError } from 'axios'

const SetupPage = async () => {
  const session = await auth()
  if (!session) return redirect('/sign-in')
  let url = ''
  try {
    const { data } = await axiosInstance(session.user.jwtToken).get(
      'api/v1/servers/first'
    )

    const parsedData = await userFirstServerResponseSchema.safeParseAsync(data)

    if (!parsedData.success) {
      console.log(`Parsing Error: ${[parsedData.error]} `)
      return
    }

    if (!parsedData.data.success) {
      return <InitialModal />
    }
    const serverId = parsedData.data.data.channel.serverId
    const channelId = parsedData.data.data.channel.id

    url = `/servers/${serverId}/channels/${channelId}`
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('error from axios interceptors', error.response?.data)
      return
    }
    console.log(error)
  } finally {
    if (url !== '') return redirect(url)
  }
}

export default SetupPage
