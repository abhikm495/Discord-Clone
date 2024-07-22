import React from "react";
import ServerHeader from "./server-header";

import {
  Server,
  ChannelType,
} from "@/schema/responseSchema/serverResponseSchema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface ServerSideBarProps {
  serverData: Server;
}

const iconMap = {
  [ChannelType.Enum.TEXT]: <Hash className="mr-4 h-4 w-4" />,
  [ChannelType.Enum.AUDIO]: <Mic className="mr-4 h-4 w-4" />,
  [ChannelType.Enum.VIDEO]: <Video className="mr-4 h-4 w-4" />,
};
enum MemberRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

const ServerSideBar = async ({ serverData }: ServerSideBarProps) => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  const textChannels = serverData.channels.filter(
    (channel) => channel.type === ChannelType.Enum.TEXT
  );
  const audioChannels = serverData.channels.filter(
    (channel) => channel.type === ChannelType.Enum.AUDIO
  );
  const videoChannels = serverData.channels.filter(
    (channel) => channel.type === ChannelType.Enum.VIDEO
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
      </ScrollArea>
    </div>
  );
};

export default ServerSideBar;
