import React from "react";
import LoginForm from "./components/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();
  if (session) redirect("/");
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default page;
