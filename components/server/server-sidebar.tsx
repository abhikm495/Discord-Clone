import React from "react";
import ServerHeader from "./server-header";

import {
  Server,
  memberRole,
  channelTypeProp,
} from "@/schema/responseSchema/serverResponseSchema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import { ServerChannel } from "./server-channel";
import ServerMember from "./server-member";

interface ServerSideBarProps {
  serverData: Server;
}

const iconMap = {
  [channelTypeProp.TEXT]: <Hash className="mr-4 h-4 w-4" />,
  [channelTypeProp.AUDIO]: <Mic className="mr-4 h-4 w-4" />,
  [channelTypeProp.VIDEO]: <Video className="mr-4 h-4 w-4" />,
};

const roleIconMap = {
  [memberRole.GUEST]: null,
  [memberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [memberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

//testing

const ServerSideBar = async ({ serverData }: ServerSideBarProps) => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  const textChannels = serverData.channels.filter(
    (channel) => channel.type === channelTypeProp.TEXT
  );
  const audioChannels = serverData.channels.filter(
    (channel) => channel.type === channelTypeProp.AUDIO
  );
  const videoChannels = serverData.channels.filter(
    (channel) => channel.type === channelTypeProp.VIDEO
  );
  const members = serverData.members.filter(
    (member) => member.profileId.toString() !== session?.user?.id
  );
  const role = serverData.members.find(
    (item) => item.profileId.toString() === session?.user?.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={serverData} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id.toString(),
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id.toString(),
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id.toString(),
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
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
                server={serverData}
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
                server={serverData}
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
                server={serverData}
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
              server={serverData}
            />
            {members.map((member) => (
              <ServerMember
                key={member.id}
                member={member}
                server={serverData}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSideBar;
