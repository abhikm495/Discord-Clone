"use client";
import { signoutAction } from "@/actions/signoutAction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
  const handleSignout = async () => {
    const toastId = toast.info("Processing");
    try {
      const res = await signoutAction();
      if (res?.type == "error") {
        toast[res.type](res.message, {
          id: toastId,
        });
      } else {
        toast.success("Sign out successful", { id: toastId });
      }
    } catch (error) {
      console.log(JSON.stringify(error, null, 4));
      console.log("something went wrong");

      console.log(error);

      toast.error("Something went wrong", {
        id: toastId,
      });
    }
  };

  return (
    <div>
      <Button onClick={handleSignout}>Sign out</Button>
    </div>
  );
};

export default Page;
