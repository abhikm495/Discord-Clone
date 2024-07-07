import { redirect } from "next/navigation";
import React from "react";
import ServerHeader, { MemberRole } from "./server-header";
import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { serverResponseSchema } from "@/schema/responseSchema/serverResponseSchema";

interface ServerSideBarProps {
  serverId: string;
}
const ServerSideBar = async ({ serverId }: ServerSideBarProps) => {
  const session = await auth();
  if (!session?.user.id) {
    return redirect("/");
  }
  try {
    const { data } = await axiosInstance(session.user.jwtToken).get(
      `api/v1/servers/server/${serverId}`
    );
    const parsedData = await serverResponseSchema.safeParseAsync(data);
    if (!parsedData.success) {
      console.log("Response Validation Error");
      return;
    }
    if (!parsedData.data.success) {
      return <div>{parsedData.data.message}</div>;
    }
    const role = parsedData.data.data.server.members.find(
      (item) => item.profileId.toString() === session.user.id
    )?.role;

    return (
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={parsedData.data.data} role={role} />
      </div>
    );
  } catch (error) {
    console.log(error);
  }
  // const server = await db.server.findUnique({
  //   where: {
  //     id: serverId,
  //   },
  //   include: {
  //     channels: {
  //       orderBy: {
  //         createdAt: "asc",
  //       },
  //     },
  //     members: {
  //       include: {
  //         profile:
  //       },
  //       orderBy: {
  //         role: "asc",
  //       },
  //     },
  //   },
  // });

  // if (!server) {
  //   return redirect("/");
  // }

  // const textChannels = server.channels.filter(
  //   (channel) => channel.type === ChannelType.TEXT
  // );
  // const audioChannels = server.channels.filter(
  //   (channel) => channel.type === ChannelType.AUDIO
  // );
  // const videoChannels = server.channels.filter(
  //   (channel) => channel.type === ChannelType.VIDEO
  // );
  // const members = server.members.filter(
  //   (member) => member.profileId !== profile.id
  // );
  // const role = server.members.find(
  //   (member) => member.profileId === profile.id
  // )?.role;
};

export default ServerSideBar;
