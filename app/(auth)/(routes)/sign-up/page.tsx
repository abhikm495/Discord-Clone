"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpSchema, signUpSchema } from "@/schema/signupSchema";
import { toast } from "sonner";
import Link from "next/link";
import ImageDropZone from "@/components/upload-image/ImageDropZone";
import { useState } from "react";
import { signupAction } from "@/actions/signupAction";

export default function Page() {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [croppedImage, setCroppedImage] = useState<File | null>(null);

  // 2. Define a submit handler.
  async function onSubmit(values: SignUpSchema) {
    if (!croppedImage) return toast.info("Please Upload Profile Image");
    const toastId = toast.info("Processing");

    try {
      const form = new FormData();
      form.append("name", values.username);
      form.append("email", values.email);
      form.append("password", values.password);
      form.append("file", croppedImage);
      const response = await signupAction(form);
      if (response && response.type === "error") {
        return toast.error(response.message, { id: toastId });
      } else {
        toast.success("Sign up successful", { id: toastId });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>Enter a unique username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>Enter your email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormDescription>Enter a password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>confirm password</FormLabel>
              <FormControl>
                <Input placeholder="confirm password" {...field} />
              </FormControl>
              <FormDescription>Confirm password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <ImageDropZone
          setCroppedImage={setCroppedImage}
          active={croppedImage ? true : false}
          content="Upload Profile Image"
        />

        <div className="flex justify-between items-center w-full">
          <Button type="submit">Submit</Button>
          <Link href={"sign-in"} className="flex flex-col items-center">
            <p>Already have an account?</p>
            <p>Sign in</p>
          </Link>
        </div>
      </form>
    </Form>
  );
}
