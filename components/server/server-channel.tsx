'use client'

import { cn } from '@/lib/utils'
import {
  Channel,
  channelTypeProp,
  Server,
} from '@/schema/responseSchema/serverResponseSchema'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { ActionToolTip } from '../action-tooltip'
import { ModalType, useModal } from '@/hooks/user-model-store'

interface ServerChannelProps {
  channel: Channel
  server: Server
  role?: 'ADMIN' | 'MODERATOR' | 'GUEST'
}

const iconMap = {
  [channelTypeProp.TEXT]: Hash,
  [channelTypeProp.AUDIO]: Mic,
  [channelTypeProp.VIDEO]: Video,
}

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const { onOpen } = useModal()

  const params = useParams()
  const router = useRouter()

  const Icon = iconMap[channel.type]

  const navigation = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { channel, server })
  }

  return (
    <div>
      <button
        onClick={navigation}
        className={cn(
          'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
          params?.channelId === channel.id.toString() &&
            'bg-zinc-700/20 dark:bg-zinc-700'
        )}
      >
        {' '}
        <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        <p
          className={cn(
            'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-300 transition',
            params?.channelId === channel.id.toString() &&
              'text-primary dark:text-zinc-200 dark:group-hover:text-white'
          )}
        >
          {channel.name}
        </p>
        {channel.name !== 'general' && role !== 'GUEST' && (
          <div className="ml-auto flex items-center gap-x-2">
            <ActionToolTip label="edit">
              <Edit
                onClick={(e) => onAction(e, 'editChannel')}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionToolTip>
            <ActionToolTip label="delete">
              <Trash
                onClick={(e) => onAction(e, 'deleteChannel')}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionToolTip>
          </div>
        )}
        {channel.name === 'general' && (
          <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>
    </div>
  )
}
