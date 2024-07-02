/* eslint-disable react/no-unescaped-entities */
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
import { signInAction } from "@/actions/signinAction";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.info("Signing in...");
    try {
      const response = await signInAction(values);
      if (response?.type === "error") {
        toast.error(response?.message, { id: toastId });
      } else {
        toast.success("Sign in successful", { id: toastId });
      }
    } catch (error) {
      console.log(JSON.stringify(error, null, 4));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Email</FormDescription>
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
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-5">
          <Button type="submit">Submit</Button>
          <Link href={"sign-up"} className="flex flex-col items-center ">
            <p> Don't have an account?</p>
            <p>Sign up</p>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
