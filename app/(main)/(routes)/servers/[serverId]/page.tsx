import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const session = await auth();
  if (!session) redirect("/sign-in");
  
  return (
    <div className="w-full flex justify-center h-full items-center">
      Server Page
    </div>
  );
};

export default ServerIdPage;
