"use server";

import { signOut } from "@/lib/auth";

const clearUserCookiesAction = async () => {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.log("clear cookie error", error);
  }
};

export default clearUserCookiesAction;
