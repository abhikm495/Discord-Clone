import ServerSideBar from "@/components/server/server-sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const session = await auth();
  if (!session) {
    return redirect("/");
  }

  // const server = await db.server.findUnique({
  //   where: {
  //     id: params.serverId,
  //     members: {
  //       some: {
  //         profileId: profile.id,
  //       },
  //     },
  //   },
  // });
  // if (!server) {
  //   return redirect("/");
  // }
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSideBar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};
export default ServerIdLayout;
