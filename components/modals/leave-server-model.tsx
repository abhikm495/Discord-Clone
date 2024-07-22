"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/user-model-store";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { updateInviteCode } from "@/actions/updateInviteCode";
import { AxiosError, isAxiosError } from "axios";
import { leaveServerAction } from "@/actions/leaveServerAction";
import { useRouter } from "next/navigation";
export function LeaveServer() {
  const { type, isOpen, onClose, data } = useModal();
  const { server } = data;
  const router = useRouter();
  const isModelOpen = isOpen && type === "leaveServer";

  const [loading, setIsLoading] = useState(false);

  const leave = async () => {
    const toastId = toast.info("Processing");
    try {
      if (!server) return toast.info("server not present", { id: toastId });
      setIsLoading(true);
      const res = await leaveServerAction(server.id);
      if (res.type === "error") {
        toast.error(res.message, { id: toastId });
      } else {
        toast.success(res.message, { id: toastId });
        onClose();
        router.push("/");
      }
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
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={loading}
              variant={"ghost"}
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button disabled={loading} variant={"primary"} onClick={leave}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
        <div className="p-6"></div>
      </DialogContent>
    </Dialog>
  );
}
