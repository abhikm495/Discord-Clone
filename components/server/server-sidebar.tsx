import React from "react";
import ServerHeader, { MemberRole } from "./server-header";

import {
  ServerResponse,
  ChannelType,
} from "@/schema/responseSchema/serverResponseSchema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface ServerSideBarProps {
  serverData: ServerResponse;
}
const ServerSideBar = async ({ serverData }: ServerSideBarProps) => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const textChannels = serverData.data.server.channels.filter(
    (channel) => channel.type === ChannelType.Enum.TEXT
  );
  const audioChannels = serverData.data.server.channels.filter(
    (channel) => channel.type === ChannelType.Enum.AUDIO
  );
  const videoChannels = serverData.data.server.channels.filter(
    (channel) => channel.type === ChannelType.Enum.VIDEO
  );
  const members = serverData.data.server.members.filter(
    (member) => member.profileId.toString() !== session?.user?.id
  );
  const role = serverData.data.server.members.find(
    (item) => item.profileId.toString() === session?.user?.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={serverData.data} role={role} />
    </div>
  );
};

export default ServerSideBar;
