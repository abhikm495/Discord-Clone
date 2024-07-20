"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";

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
import ImageDropZone from "../upload-image/ImageDropZone";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createServerAction } from "@/actions/createServerAction";
import Image from "next/image";
import { updateServerAction } from "@/actions/updateServerAction";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
});

export function EditServerModal() {
  const { type, isOpen, onClose, data } = useModal();
  const router = useRouter();
  const { server } = data;
  const isModelOpen = isOpen && type === "editServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!croppedImage) return toast.info("Please Upload Profile Image");
    const toastId = toast.info("Processing");
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("file", croppedImage);
      if (!server)
        return toast.error("could'nt fetch server details", { id: toastId });
      const response = await updateServerAction(formData, server.id);
      if (response && response.type === "error") {
        return toast.error(response.message, { id: toastId });
      } else {
        toast.success(response.message, { id: toastId });
        onClose();
        setCroppedImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
    setCroppedImage(null);
  };

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
    }
  }, [server, form]);

  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize Your Server
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Give Your Server a personality with a name and an image.You can
            always change it later
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            {server && !croppedImage && (
              <div className="flex justify-center items-center my-6">
                <div className="relative w-40 h-40 rounded-full overflow-hidden">
                  <Image
                    src={server?.imageUrl}
                    alt="server-img"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              </div>
            )}

            <div className="space-y-8 py-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="px-2">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter Server Name"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex justify-center items-center pb-10">
              <ImageDropZone
                active={croppedImage ? true : false}
                setCroppedImage={setCroppedImage}
                content={"Update server image"}
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
