"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/user-model-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { toast } from "sonner";
import { updateInviteCode } from "@/actions/updateInviteCode";
import { AxiosError, isAxiosError } from "axios";

export function InviteModal() {
  const { type, isOpen, onClose, data, onOpen } = useModal();
  const { server } = data;
  const origin = useOrigin();
  const isModelOpen = isOpen && type === "invite";

  const [loading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const generateNewCode = async () => {
    const toastId = toast.info("Processing");
    try {
      if (!server) return toast.info("server not present", { id: toastId });
      setIsLoading(true);
      const res = await updateInviteCode(server.id);
      if (res.type === "success") {
        toast.success(res.message);
        onOpen("invite", { server: { ...server, inviteCode: res.data } });
      } else toast.error(res.message);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message, { id: toastId });
      }
      toast.error("something went wrong", { id: toastId });
    }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={loading}
            />
            <Button size={"icon"} onClick={onCopy} disabled={loading}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={loading}
            variant={"link"}
            size={"sm"}
            className="text-sm text-zinc-500 mt-4"
            onClick={generateNewCode}
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
