"use client";

import { CreateServerModel } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "../modals/invite-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { MembersModal } from "../modals/members-modal";
import { CreateChannelModel } from "../modals/create-channel-modal";
import { LeaveServer } from "../modals/leave-server-model";
import { DeleteServerModal } from "../modals/delete-server-model";

export const ModelProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
      <CreateServerModel />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModel />
      <LeaveServer />
      <DeleteServerModal />
    </>
  );
};
