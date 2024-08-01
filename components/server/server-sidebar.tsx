import React from 'react'
import ServerHeader from './server-header'

import {
  Server,
  memberRole,
  channelTypeProp,
  serverResponseSchema,
} from '@/schema/responseSchema/serverResponseSchema'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ScrollArea } from '../ui/scroll-area'
import ServerSearch from './server-search'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Separator } from '../ui/separator'
import ServerSection from './server-section'
import { ServerChannel } from './server-channel'
import ServerMember from './server-member'
import axiosInstance from '@/lib/axios-instance'

interface ServerSideBarProps {
  serverData: Server
}

const iconMap = {
  [channelTypeProp.TEXT]: <Hash className="mr-4 h-4 w-4" />,
  [channelTypeProp.AUDIO]: <Mic className="mr-4 h-4 w-4" />,
  [channelTypeProp.VIDEO]: <Video className="mr-4 h-4 w-4" />,
}

const roleIconMap = {
  [memberRole.GUEST]: null,
  [memberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [memberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
}

//testing

const ServerSideBar = async ({ serverId }: { serverId: string }) => {
  const session = await auth()
  if (!session) {
    redirect('/sign-in')
  }
  try {
    const { data } = await axiosInstance(session.user.jwtToken).get(
      `api/v1/servers/server/${serverId}`
    )

    const parsedData = await serverResponseSchema.safeParseAsync(data)
    if (!parsedData.success) {
      console.log('Response Validation Error')
      return
    }
    if (!parsedData.data.success) {
      return <div>{parsedData.data.message}</div>
    }
    const textChannels = parsedData.data.data.server.channels.filter(
      (channel) => channel.type === channelTypeProp.TEXT
    )
    const audioChannels = parsedData.data.data.server.channels.filter(
      (channel) => channel.type === channelTypeProp.AUDIO
    )
    const videoChannels = parsedData.data.data.server.channels.filter(
      (channel) => channel.type === channelTypeProp.VIDEO
    )
    const members = parsedData.data.data.server.members.filter(
      (member) => member.profileId.toString() !== session?.user?.id
    )
    const role = parsedData.data.data.server.members.find(
      (item) => item.profileId.toString() === session?.user?.id
    )?.role

    return (
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={parsedData.data.data.server} role={role} />
        <ScrollArea className="flex-1 px-3">
          <div className="mt-2">
            <ServerSearch
              data={[
                {
                  label: 'Text Channels',
                  type: 'channel',
                  data: textChannels.map((channel) => ({
                    id: channel.id.toString(),
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: 'Voice Channels',
                  type: 'channel',
                  data: audioChannels.map((channel) => ({
                    id: channel.id.toString(),
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: 'Video Channels',
                  type: 'channel',
                  data: videoChannels.map((channel) => ({
                    id: channel.id.toString(),
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: 'Members',
                  type: 'member',
                  data: members.map((member) => ({
                    id: member.id.toString(),
                    name: member.profile.name,
                    icon: roleIconMap[member.role],
                  })),
                },
              ]}
            />
          </div>
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          {!!textChannels.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="channels"
                channelType={channelTypeProp.TEXT}
                role={role}
                label="Text Channels"
              />
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={parsedData.data.data.server}
                />
              ))}
            </div>
          )}
          {!!audioChannels.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="channels"
                channelType={channelTypeProp.AUDIO}
                role={role}
                label="Audio Channels"
              />
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={parsedData.data.data.server}
                />
              ))}
            </div>
          )}
          {!!videoChannels.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="channels"
                channelType={channelTypeProp.VIDEO}
                role={role}
                label="Video Channels"
              />
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={parsedData.data.data.server}
                />
              ))}
            </div>
          )}
          {!!members.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="members"
                role={role}
                label="Members"
                server={parsedData.data.data.server}
              />
              {members.map((member) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={parsedData.data.data.server}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    )
  } catch (error) {
    console.log(error)
  }
}

export default ServerSideBar
