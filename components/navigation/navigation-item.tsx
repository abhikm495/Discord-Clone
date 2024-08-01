'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ActionToolTip } from '@/components/action-tooltip'
import Link from 'next/link'

interface NavigationItemProps {
  channelId: number
  id: number
  imageUrl: string
  name: string
}

const NavigationItem = ({
  id,
  imageUrl,
  name,
  channelId,
}: NavigationItemProps) => {
  const params = useParams()

  return (
    <ActionToolTip side="right" align="center" label={name}>
      <Link
        href={`/servers/${id}/channels/${channelId}`}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w=[4px]',
            params?.serverId !== id.toString() && 'group-hover:h-[20px]',
            params?.serverId === id.toString() ? 'h-[36px]' : 'h-[8px]'
          )}
        />
        {params.serverId === id.toString() ? (
          <div
            className={`
    h-[2px] w-[0.1rem] 
    after:absolute after:content-[''] after:h-[35px] after:w-[3px] after:bg-current after:top-[0.25rem] after:left-0
  `}
          />
        ) : (
          <div
            className={`
    h-[10px] w-[0.1rem] 
    after:absolute after:content-[''] after:h-[10px] after:w-[3px] after:bg-current  after:left-0
  `}
          />
        )}

        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden ',
            params?.serverId === id.toString() &&
              'bg-primary/10 text-primary rounded-[16px] '
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </Link>
    </ActionToolTip>
  )
}

export default NavigationItem
