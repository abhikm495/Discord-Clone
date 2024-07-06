// import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { InitialModel } from "@/components/modals/initial-model";
import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { userFirstServerResponseSchema } from "@/schema/responseSchema/usersFirstServerResponseSchema";
import { NextResponse } from "next/server";

const SetupPage = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in");
  let url = "";
  try {
    const { data } = await axiosInstance(session.user.jwtToken).get(
      "api/v1/servers/first"
    );
    const parsedData = await userFirstServerResponseSchema.safeParseAsync(data);
    if (!parsedData.success) {
      console.log(`Parsing Error: ${[parsedData.error]} `);
      return;
    }
    console.log(parsedData.data.success);

    if (!parsedData.data.success) {
      return <InitialModel />;
    }
    url = `servers/${parsedData.data.data.serverId}`;
  } catch (error) {
    console.log(error);
    return;
  } finally {
    if (url !== "") return redirect(url);
  }
};

export default SetupPage;
