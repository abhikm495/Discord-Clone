import ServerSideBar from "@/components/server/server-sidebar";
import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { serverResponseSchema } from "@/schema/responseSchema/serverResponseSchema";
import axios from "axios";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  try {
    const session = await auth();
    if (!session?.user.id) {
      return redirect("/");
    }
    const { data } = await axiosInstance(session.user.jwtToken).get(
      `api/v1/servers/server/${params.serverId}`
    );
    const parsedData = await serverResponseSchema.safeParseAsync(data);
    if (!parsedData.success) {
      console.log("Response Validation Error");
      return;
    }
    if (!parsedData.data.success) {
      return <div>{parsedData.data.message}</div>;
    }
    return (
      <div className="h-full">
        <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
          <ServerSideBar serverData={parsedData.data} />
        </div>
        <main className="h-full md:pl-60">{children}</main>
      </div>
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return <div>Server not found </div>;
      } else if (error.response?.status === 403) {
        return <div>You are not a part of this server</div>;
      } else return <div>{JSON.stringify(error)}</div>;
    }
    return JSON.stringify(error);
  }
};

export default ServerIdLayout;
