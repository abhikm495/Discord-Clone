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

import axios from "axios";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import ImageDropZone from "../upload-image/ImageDropZone";
import { toast } from "sonner";
import { createServerAction } from "@/actions/createServerAction";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
});

export function InitialModel() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      const form = new FormData();
      form.append("name", values.name);
      form.append("file", croppedImage);

      const response = await createServerAction(form);
      if (response && response.type === "error") {
        return toast.error(response.message, { id: toastId });
      } else {
        toast.success("Server created successfully", { id: toastId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) return null;
  return (
    <Dialog open>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="mx-5">
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

            <DialogFooter className="bg-gray-100 px-6 py-4 ">
              <Button
                variant={"primary"}
                className="w-full"
                disabled={isLoading}
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
