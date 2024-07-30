"use client";

import {
  channelTypeProp,
  memberRole,
  Server,
} from "@/schema/responseSchema/serverResponseSchema";
import { ActionToolTip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/user-model-store";
interface ServerSectionProps {
  label: string;
  role?: "ADMIN" | "MODERATOR" | "GUEST";
  sectionType: "channels" | "members";
  channelType?: channelTypeProp;
  server?: Server;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== memberRole.GUEST && sectionType === "channels" && (
        <ActionToolTip label="Create Channel" side="top">
          <button
            className="text-zinc-50 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("createChannel", { channelType })}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionToolTip>
      )}
      {role === memberRole.ADMIN && sectionType === "members" && (
        <ActionToolTip label="Manage Members" side="top">
          <button
            className="text-zinc-50 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("members", { server })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionToolTip>
      )}
    </div>
  );
};

export default ServerSection;
