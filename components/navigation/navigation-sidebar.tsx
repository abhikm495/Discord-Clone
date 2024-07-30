import { redirect } from 'next/navigation'
import React from 'react'
import { NavigationAction } from '@/components/navigation/navigation-action'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import NavigationItem from '@/components/navigation/navigation-item'
import { ModeToggle } from '../mode-toggle'
import { auth } from '@/lib/auth'
import axiosInstance from '@/lib/axios-instance'
import { userServersResponseSchema } from '@/schema/responseSchema/usersServerResponseSchema'
import SignOutButton from './components/SignoutButton'
const NavigationSideBar = async () => {
  const session = await auth()
  if (!session) return redirect('/')
  try {
    const { data } = await axiosInstance(session.user.jwtToken).get(
      'api/v1/servers/user'
    )

    const parsedData = await userServersResponseSchema.safeParseAsync(data)
    if (!parsedData.success) {
      console.log('Response Validation Error')
      return
    }
    if (!parsedData.data.success) {
      ;<div>{!parsedData.data.message}</div>
    }
    const servers = parsedData.data.data.servers

    return (
      <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
        <NavigationAction />
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
        <ScrollArea className="flex-1 w-full">
          {servers.map((server) => {
            return (
              <div key={server.id} className="mb-4">
                <NavigationItem
                  channelId={server.channels[0].id}
                  id={server.id}
                  name={server.name}
                  imageUrl={server.imageUrl}
                />
              </div>
            )
          })}
        </ScrollArea>
        <div className="pb-3 mt-auto flex items-center  flex-col gap-y-4">
          <ModeToggle />
          <SignOutButton />
        </div>
      </div>
    )
  } catch (error) {
    console.log(error)
  }
}

export default NavigationSideBar
