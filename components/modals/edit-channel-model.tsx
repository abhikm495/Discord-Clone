"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/user-model-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { channelTypeProp } from "@/schema/responseSchema/serverResponseSchema";
import { createChannelAction } from "@/actions/createChannelAction";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { editChannelAction } from "@/actions/editChanelAction";
export function EditChannelModal() {
  const { type, isOpen, onClose, data } = useModal();
  const { channel, server } = data;
  const isModelOpen = isOpen && type === "editChannel";

  const formSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: "Channel name is required.",
      })
      .refine((name) => name.toLowerCase() !== "general", {
        message: 'Channel name cannot be "General".',
      }),
    type: z.nativeEnum(channelTypeProp),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelTypeProp.TEXT,
    },
  });

  useEffect(() => {
    if (channel) {
      console.log("yeh hai type", channel.type);

      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [form, channel]);
  const isLoading = form.formState.isSubmitting;
  const searchparams = useParams();
  const serverId = searchparams.serverId;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.info("Processing");
    try {
      if (!serverId) return toast.error("Server not present", { id: toastId });
      if (!channel) return toast.error("Channel not present", { id: toastId });
      const serverIdNumber = parseInt(serverId as string, 10);

      if (isNaN(serverIdNumber)) {
        return toast.error("Invalid server ID", { id: toastId });
      }

      const response = await editChannelAction(
        serverIdNumber,
        channel?.id,
        values
      );
      if (response && response.type === "error") {
        return toast.error(response.message, { id: toastId });
      } else {
        toast.success(response.message, { id: toastId });
        form.reset();
        onClose();
      }
    } catch (error) {
      console.log("channel creation error", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space=-">
            <div className="space-y-8 py-6 px-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="px-2">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter Channel Name"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(channelTypeProp).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className=" hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
                          >
                            {type.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                variant={"primary"}
                disabled={isLoading}
                className="w-full"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
