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
import { useState } from "react";
import { createServerAction } from "@/actions/createServerAction";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
});

export function CreateServerModel() {
  const { type, isOpen, onClose } = useModal();
  const router = useRouter();

  const isModelOpen = isOpen && type === "createServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // const a = async (values: z.infer<typeof formSchema>) => {
  //   try {
  //     await axios.post("/api/servers", values);
  //     form.rese;
  //     router.refresh();
  //     onClose();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!croppedImage) return toast.info("Please Upload Profile Image");
    const toastId = toast.info("Processing");
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("file", croppedImage);

      const response = await createServerAction(formData);
      if (response && response.type === "error") {
        return toast.error(response.message, { id: toastId });
      } else {
        toast.success("Server created successfully", { id: toastId });
        form.reset();
        router.refresh();
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
  };

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
                content={"Upload Server Image"}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                variant={"primary"}
                disabled={isLoading}
                className="w-full"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
