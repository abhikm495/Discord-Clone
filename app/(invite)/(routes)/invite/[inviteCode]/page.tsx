import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { z } from "zod";
import CountdownDialog from "./components/CountDown";

const inviteCodeResponseSchema = z.object({
  data: z.string(),
  success: z.boolean(),
  message: z.string(),
});

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  try {
    const { data } = await axiosInstance(session.user.jwtToken).patch(
      `api/v1/servers/invite/${params.inviteCode}`
    );
    const parsedData = await inviteCodeResponseSchema.safeParseAsync(data);
    if (!parsedData.success) {
      throw new Error("Response validation error");
    }
    return (
      <CountdownDialog
        serverId={parseInt(parsedData.data.data)}
        message={parsedData.data.message}
      />
    );
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return <div>{error.response.data.message}</div>;
    }
    console.log(error);
    return <div>An unexpected error occurred</div>;
  }
};

export default InviteCodePage;
