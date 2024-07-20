"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface CountdownDialogProps {
  message: string;
  serverId: number;
}

const CountdownDialog = ({ message, serverId }: CountdownDialogProps) => {
  const [countdown, setCountdown] = useState(5);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push(`/servers/${serverId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [serverId, router]);
  if (!mounted) return null;
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[550px] max-h-[300px] flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl rounded-xl">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-3xl font-bold tracking-tight">
            {message}
          </DialogTitle>
          <DialogDescription className="text-xl font-semibold text-indigo-100">
            Redirecting in{" "}
            <span className="text-2xl text-yellow-300">{countdown}</span>{" "}
            seconds...
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 animate-pulse">
          <svg
            className="w-12 h-12 text-indigo-200"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountdownDialog;
